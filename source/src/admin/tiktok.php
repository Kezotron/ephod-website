<?php
/**
 * EPHOD Poster — TikTok backend (ephodlifestyle.com/memoryverse/tiktok.php).
 *
 * The approval page (tiktok-poster.html) talks to this script. It never posts anything by itself: a person
 * connects the EPHOD TikTok account once, reviews each video on the page and presses Post.
 *
 * Settings go in domains/<site>/ephod-config.local.php (never in Git — the repo is public):
 *     define('TIKTOK_CLIENT_KEY', '...');      // TikTok developer portal -> app -> Credentials
 *     define('TIKTOK_CLIENT_SECRET', '...');
 *     define('TIKTOK_ADMIN_KEY', '...');       // password that opens the approval page (you choose it)
 *     define('TIKTOK_INBOX_KEY', '...');       // long random string; the same value is the GitHub secret TT_INBOX_KEY
 *
 * Files (tokens, videos waiting for approval, a log of posts) live in domains/<site>/tiktok/, outside public_html.
 *
 * Actions (?action=):
 *   inbox_put      POST  X-Inbox-Key header + multipart: id, meta (JSON), video   (the daily render sends the video here)
 *   status         GET   connected account + number of videos waiting
 *   login          GET   TikTok sign-in address
 *   callback       POST  code + state from TikTok's redirect -> stores the account's tokens
 *   disconnect     POST
 *   creator        GET   TikTok creator info: nickname, privacy options, limits (required before every post)
 *   list           GET   videos waiting / posted
 *   video          GET   streams one video for the preview player
 *   post           POST  sends one video to TikTok with the choices made on the page
 *   publish_status GET   what TikTok says about a post in progress
 * Everything except inbox_put needs the admin key (header X-Key, or ?key= for the video player).
 */
if (PHP_SAPI === 'cli') { exit("web only\n"); }
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$home = getenv('EPHOD_HOME') ?: dirname(__DIR__, 2);          // domains/<site>/
$cfgFile = $home . '/ephod-config.local.php';
if (is_file($cfgFile)) require $cfgFile;
if (!defined('TIKTOK_CLIENT_KEY') || !defined('TIKTOK_ADMIN_KEY')) { http_response_code(404); exit; }   // not set up on this site
foreach (['TIKTOK_CLIENT_SECRET', 'TIKTOK_INBOX_KEY'] as $c) if (!defined($c)) define($c, '');
if (!defined('TIKTOK_API_BASE')) define('TIKTOK_API_BASE', 'https://open.tiktokapis.com');
if (!defined('TIKTOK_AUTH_URL')) define('TIKTOK_AUTH_URL', 'https://www.tiktok.com/v2/auth/authorize/');
define('TT_SCOPES', 'user.info.basic,video.upload,video.publish');
define('TT_DIR', $home . '/tiktok');
$siteUrl = 'https://ephodlifestyle.com';
$__sj = @json_decode(@file_get_contents(__DIR__ . '/site.json'), true);
if (!empty($__sj['url'])) $siteUrl = rtrim($__sj['url'], '/');
define('TT_REDIRECT', getenv('TIKTOK_REDIRECT') ?: $siteUrl . '/tiktok-callback.html');
foreach ([TT_DIR, TT_DIR . '/inbox'] as $d) if (!is_dir($d)) @mkdir($d, 0700, true);

$action = $_GET['action'] ?? '';

// ---------- the daily render hands a video over ----------
if ($action === 'inbox_put') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('POST only', 405);
    $k = $_SERVER['HTTP_X_INBOX_KEY'] ?? '';
    if (TIKTOK_INBOX_KEY === '' || !hash_equals(TIKTOK_INBOX_KEY, $k)) fail('Wrong inbox key', 403);
    if (!$_POST && !$_FILES && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0)
        fail('The video is larger than this server accepts (post_max_size is ' . ini_get('post_max_size') . ', upload_max_filesize ' . ini_get('upload_max_filesize') . '). Raise both in hPanel, PHP Configuration.', 413);
    $id = (string)($_POST['id'] ?? '');
    if (!preg_match('/^[0-9a-z-]{3,60}$/', $id)) fail('Bad id');
    $f = $_FILES['video'] ?? null;
    if (!$f || $f['error'] !== UPLOAD_ERR_OK) fail('Upload failed (code ' . ($f['error'] ?? '?') . ')');
    if ($f['size'] > 64 * 1024 * 1024) fail('Video is larger than 64 MB');
    $head = file_get_contents($f['tmp_name'], false, null, 0, 12);
    if (substr($head, 4, 4) !== 'ftyp') fail('Not an MP4 file');
    $meta = json_decode((string)($_POST['meta'] ?? '{}'), true) ?: [];
    $meta = ['id' => $id, 'lang' => substr((string)($meta['lang'] ?? ''), 0, 8), 'date' => substr((string)($meta['date'] ?? ''), 0, 10),
             'reference' => substr((string)($meta['reference'] ?? ''), 0, 120), 'caption' => mb_substr((string)($meta['caption'] ?? ''), 0, 2200),
             'page' => substr((string)($meta['page'] ?? ''), 0, 8), 'received' => gmdate('c'), 'size' => (int)$f['size']];
    if (!move_uploaded_file($f['tmp_name'], TT_DIR . "/inbox/$id.mp4")) { if (!@copy($f['tmp_name'], TT_DIR . "/inbox/$id.mp4")) fail('Could not store the video', 500); }
    file_put_contents(TT_DIR . "/inbox/$id.json", json_encode($meta, JSON_UNESCAPED_UNICODE));
    prune_inbox();
    out(['success' => true, 'id' => $id]);
}

// ---------- everything else is for the person who approves ----------
$key = $_SERVER['HTTP_X_KEY'] ?? ($_GET['key'] ?? '');
if (TIKTOK_ADMIN_KEY === '' || !hash_equals(TIKTOK_ADMIN_KEY, (string)$key)) fail('Wrong key', 403);

switch ($action) {
    case 'status': {
        $t = load_token();
        $n = count(inbox_items());
        out(['success' => true, 'configured' => TIKTOK_CLIENT_SECRET !== '', 'connected' => (bool)$t, 'account' => $t['account'] ?? null, 'waiting' => $n]);
    }
    case 'login': {
        if (TIKTOK_CLIENT_SECRET === '') fail('TIKTOK_CLIENT_SECRET is not set in ephod-config.local.php');
        $state = bin2hex(random_bytes(16));
        file_put_contents(TT_DIR . '/state.json', json_encode(['state' => $state, 'at' => time()]));
        $q = http_build_query(['client_key' => TIKTOK_CLIENT_KEY, 'scope' => TT_SCOPES, 'response_type' => 'code', 'redirect_uri' => TT_REDIRECT, 'state' => $state]);
        out(['success' => true, 'url' => TIKTOK_AUTH_URL . '?' . $q]);
    }
    case 'callback': {
        need_post();
        $st = @json_decode((string)@file_get_contents(TT_DIR . '/state.json'), true);
        if (!$st || !hash_equals((string)$st['state'], (string)($_POST['state'] ?? '')) || time() - (int)$st['at'] > 1800) fail('This sign-in link has expired. Press Connect TikTok again.');
        @unlink(TT_DIR . '/state.json');
        $code = (string)($_POST['code'] ?? '');
        if ($code === '') fail('TikTok did not send a code');
        $r = tt_form('/v2/oauth/token/', ['client_key' => TIKTOK_CLIENT_KEY, 'client_secret' => TIKTOK_CLIENT_SECRET, 'code' => $code,
                                           'grant_type' => 'authorization_code', 'redirect_uri' => TT_REDIRECT]);
        if (empty($r['access_token'])) fail('TikTok refused the sign-in: ' . ($r['error_description'] ?? $r['error'] ?? json_encode($r)));
        $t = token_from($r);
        $u = tt_get('/v2/user/info/?fields=open_id,avatar_url,display_name', $t['access_token']);
        $t['account'] = ['open_id' => $u['data']['user']['open_id'] ?? ($r['open_id'] ?? ''), 'name' => $u['data']['user']['display_name'] ?? '', 'avatar' => $u['data']['user']['avatar_url'] ?? ''];
        save_token($t);
        out(['success' => true, 'account' => $t['account']]);
    }
    case 'disconnect': need_post(); @unlink(TT_DIR . '/token.json'); out(['success' => true]);
    case 'creator': {
        $r = tt_json('/v2/post/publish/creator_info/query/', [], access_token());
        tt_check($r);
        out(['success' => true, 'creator' => $r['data'] ?? []]);
    }
    case 'list': {
        $posts = posts_log();
        $items = array_map(function ($m) use ($posts) { $m['post'] = $posts[$m['id']] ?? null; return $m; }, inbox_items());
        out(['success' => true, 'items' => $items]);
    }
    case 'video': {
        $id = (string)($_GET['id'] ?? ''); if (!preg_match('/^[0-9a-z-]{3,60}$/', $id) || !is_file(TT_DIR . "/inbox/$id.mp4")) fail('No such video', 404);
        stream_video(TT_DIR . "/inbox/$id.mp4");
    }
    case 'post': {
        need_post();
        $id = (string)($_POST['id'] ?? ''); $file = TT_DIR . "/inbox/$id.mp4";
        if (!preg_match('/^[0-9a-z-]{3,60}$/', $id) || !is_file($file)) fail('No such video');
        $title = trim((string)($_POST['title'] ?? '')); if (mb_strlen($title) > 2200) fail('The caption is longer than 2,200 characters');
        $privacy = (string)($_POST['privacy_level'] ?? '');
        $brandOrganic = ($_POST['brand_organic_toggle'] ?? '') === '1'; $brandContent = ($_POST['brand_content_toggle'] ?? '') === '1';
        if (($_POST['commercial'] ?? '') === '1' && !$brandOrganic && !$brandContent) fail('Choose what the commercial content promotes, or turn the disclosure off');
        if (($_POST['commercial'] ?? '') !== '1') { $brandOrganic = false; $brandContent = false; }
        if ($brandContent && $privacy === 'SELF_ONLY') fail('Branded content cannot be private');
        $tok = access_token();
        $c = tt_json('/v2/post/publish/creator_info/query/', [], $tok); tt_check($c);                  // TikTok requires this before every post
        $cr = $c['data'] ?? [];
        if (!in_array($privacy, $cr['privacy_level_options'] ?? [], true)) fail('That privacy option is not available for this account right now');
        $size = filesize($file);
        $max = (int)($cr['max_video_post_duration_sec'] ?? 0); $dur = mp4_seconds($file);
        if ($max && $dur && $dur > $max + 0.5) fail("The video is {$dur}s; this account can post at most {$max}s");
        if ($size > 64 * 1024 * 1024) fail('Video is larger than 64 MB');
        $post = ['title' => $title, 'privacy_level' => $privacy, 'video_cover_timestamp_ms' => $dur ? (int)round(min(5000, $dur * 0.2 * 1000)) : 4000,   // a frame where the verse is already on screen
                 'disable_comment' => ($_POST['allow_comment'] ?? '') !== '1' || !empty($cr['comment_disabled']),
                 'disable_duet' => ($_POST['allow_duet'] ?? '') !== '1' || !empty($cr['duet_disabled']),
                 'disable_stitch' => ($_POST['allow_stitch'] ?? '') !== '1' || !empty($cr['stitch_disabled'])];
        if ($brandOrganic || $brandContent) { $post['brand_content_toggle'] = $brandContent; $post['brand_organic_toggle'] = $brandOrganic; }
        $init = tt_json('/v2/post/publish/video/init/', ['post_info' => $post, 'source_info' => ['source' => 'FILE_UPLOAD', 'video_size' => $size, 'chunk_size' => $size, 'total_chunk_count' => 1]], $tok);
        tt_check($init);
        $pid = $init['data']['publish_id'] ?? ''; $up = $init['data']['upload_url'] ?? '';
        if ($pid === '' || $up === '') fail('TikTok did not give an upload address');
        $ch = curl_init($up); $fh = fopen($file, 'rb');
        curl_setopt_array($ch, [CURLOPT_PUT => true, CURLOPT_INFILE => $fh, CURLOPT_INFILESIZE => $size, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 600,
            CURLOPT_HTTPHEADER => ['Content-Type: video/mp4', 'Content-Length: ' . $size, 'Content-Range: bytes 0-' . ($size - 1) . '/' . $size]]);
        $resp = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE); $err = curl_error($ch); fclose($fh);
        if ($resp === false || $code < 200 || $code >= 300) fail("Uploading to TikTok failed (HTTP $code) $err " . substr((string)$resp, 0, 200), 502);
        $log = posts_log(); $log[$id] = ['publish_id' => $pid, 'at' => gmdate('c'), 'privacy' => $privacy, 'title' => $title]; file_put_contents(TT_DIR . '/posts.json', json_encode($log));
        out(['success' => true, 'publish_id' => $pid]);
    }
    case 'publish_status': {
        $pid = (string)($_GET['publish_id'] ?? ''); if ($pid === '') fail('publish_id missing');
        $r = tt_json('/v2/post/publish/status/fetch/', ['publish_id' => $pid], access_token()); tt_check($r);
        out(['success' => true, 'status' => $r['data']['status'] ?? '', 'fail_reason' => $r['data']['fail_reason'] ?? '']);
    }
    default: fail('Unknown action');
}

// ---------- helpers ----------
function out($a, $code = 200) { http_response_code($code); header('Content-Type: application/json; charset=utf-8'); echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail($m, $code = 400) { out(['success' => false, 'error' => $m], $code); }
function need_post() { if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('POST only', 405); }

function http($method, $url, $headers = [], $body = null) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 60, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => array_merge(['User-Agent: EPHOD-Poster/1.0'], $headers)]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $r = curl_exec($ch);
    if ($r === false) fail('Could not reach TikTok: ' . curl_error($ch), 502);
    $j = json_decode($r, true);
    return is_array($j) ? $j : ['error' => ['code' => 'bad_response', 'message' => substr($r, 0, 200)]];
}
function tt_form($path, $fields) { return http('POST', TIKTOK_API_BASE . $path, ['Content-Type: application/x-www-form-urlencoded', 'Cache-Control: no-cache'], http_build_query($fields)); }
function tt_json($path, $body, $tok) { return http('POST', TIKTOK_API_BASE . $path, ['Authorization: Bearer ' . $tok, 'Content-Type: application/json; charset=UTF-8'], $body ? json_encode($body) : '{}'); }
function tt_get($path, $tok) { return http('GET', TIKTOK_API_BASE . $path, ['Authorization: Bearer ' . $tok]); }
function tt_check($r) { $c = $r['error']['code'] ?? 'ok'; if ($c !== 'ok') fail('TikTok said: ' . ($r['error']['message'] ?? $c) . " ($c)", 502); }

function token_from($r) { return ['access_token' => $r['access_token'], 'refresh_token' => $r['refresh_token'] ?? '', 'open_id' => $r['open_id'] ?? '',
    'expires_at' => time() + (int)($r['expires_in'] ?? 0) - 120, 'refresh_expires_at' => time() + (int)($r['refresh_expires_in'] ?? 0) - 120, 'scope' => $r['scope'] ?? '']; }
function load_token() { $t = @json_decode((string)@file_get_contents(TT_DIR . '/token.json'), true); return is_array($t) ? $t : null; }
function save_token($t) { file_put_contents(TT_DIR . '/token.json', json_encode($t)); @chmod(TT_DIR . '/token.json', 0600); }
function access_token() {
    $t = load_token(); if (!$t) fail('TikTok is not connected yet. Press Connect TikTok.', 409);
    if (time() < $t['expires_at']) return $t['access_token'];
    if (time() >= $t['refresh_expires_at']) { @unlink(TT_DIR . '/token.json'); fail('The TikTok connection has expired. Press Connect TikTok again.', 409); }
    $r = tt_form('/v2/oauth/token/', ['client_key' => TIKTOK_CLIENT_KEY, 'client_secret' => TIKTOK_CLIENT_SECRET, 'grant_type' => 'refresh_token', 'refresh_token' => $t['refresh_token']]);
    if (empty($r['access_token'])) fail('Could not renew the TikTok connection: ' . ($r['error_description'] ?? $r['error'] ?? json_encode($r)) . '. Press Connect TikTok again.', 409);
    $n = token_from($r); $n['account'] = $t['account'] ?? null; save_token($n);
    return $n['access_token'];
}

function inbox_items() {
    $out = [];
    foreach (glob(TT_DIR . '/inbox/*.json') ?: [] as $f) {
        $m = json_decode(file_get_contents($f), true); if (!is_array($m) || !is_file(TT_DIR . "/inbox/{$m['id']}.mp4")) continue;
        $out[] = $m;
    }
    usort($out, fn($a, $b) => strcmp($b['received'] ?? '', $a['received'] ?? ''));
    return $out;
}
function posts_log() { $l = @json_decode((string)@file_get_contents(TT_DIR . '/posts.json'), true); return is_array($l) ? $l : []; }
function prune_inbox() {   // keep the newest 40 videos
    $items = inbox_items();
    foreach (array_slice($items, 40) as $m) { @unlink(TT_DIR . "/inbox/{$m['id']}.mp4"); @unlink(TT_DIR . "/inbox/{$m['id']}.json"); }
}
function mp4_seconds($file) {   // movie header duration, no ffmpeg needed
    $fh = fopen($file, 'rb'); $size = filesize($file); $pos = 0;
    while ($pos + 8 <= $size) {
        fseek($fh, $pos); $h = fread($fh, 8); if (strlen($h) < 8) break;
        $len = unpack('N', substr($h, 0, 4))[1]; $type = substr($h, 4, 4);
        if ($len === 1) { $e = fread($fh, 8); $len = unpack('J', $e)[1]; $hdr = 16; } else $hdr = 8;
        if ($type === 'moov') {
            $end = min($size, $pos + $len); $p = $pos + $hdr;
            while ($p + 8 <= $end) {
                fseek($fh, $p); $b = fread($fh, 8); $bl = unpack('N', substr($b, 0, 4))[1]; $bt = substr($b, 4, 4);
                if ($bt === 'mvhd') { $d = fread($fh, 32); $ver = ord($d[0]);
                    if ($ver === 1) { $ts = unpack('N', substr($d, 20, 4))[1]; $du = unpack('J', substr($d, 24, 8))[1]; } else { $ts = unpack('N', substr($d, 12, 4))[1]; $du = unpack('N', substr($d, 16, 4))[1]; }
                    fclose($fh); return $ts ? round($du / $ts, 1) : 0; }
                if ($bl < 8) break; $p += $bl;
            }
        }
        if ($len < 8) break; $pos += $len;
    }
    fclose($fh); return 0;
}
function stream_video($file) {
    $size = filesize($file); $start = 0; $end = $size - 1;
    header('Content-Type: video/mp4'); header('Accept-Ranges: bytes');
    if (!empty($_SERVER['HTTP_RANGE']) && preg_match('/bytes=(\d*)-(\d*)/', $_SERVER['HTTP_RANGE'], $m)) {
        if ($m[1] !== '') $start = (int)$m[1]; if ($m[2] !== '') $end = min($end, (int)$m[2]);
        if ($m[1] === '' && $m[2] !== '') { $start = max(0, $size - (int)$m[2]); $end = $size - 1; }
        if ($start > $end) { http_response_code(416); exit; }
        http_response_code(206); header("Content-Range: bytes $start-$end/$size");
    }
    header('Content-Length: ' . ($end - $start + 1));
    $fh = fopen($file, 'rb'); fseek($fh, $start); $left = $end - $start + 1;
    while ($left > 0 && !feof($fh)) { $buf = fread($fh, min(65536, $left)); echo $buf; $left -= strlen($buf); }
    fclose($fh); exit;
}
