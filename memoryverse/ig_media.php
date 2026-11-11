<?php
/**
 * EPHOD — temporary public home for the daily videos that Instagram fetches (ephod4png.com/memoryverse/ig_media.php).
 *
 * Instagram cannot take an uploaded file: its servers download the video from a public web address. The daily
 * render (ephod-social, scripts/ig.py) uploads each video here, gets the address back, and gives it to Instagram.
 * Videos are deleted after 3 days.
 *
 * Setting in domains/<site>/ephod-config.local.php (never in Git — the repo is public):
 *     define('IG_MEDIA_KEY', '...');    // long random string; the same value is the GitHub secret IG_MEDIA_KEY
 * Without it this script answers 404 (so it does nothing on a site that is not set up for it).
 *
 * Actions (?action=):
 *   put   POST  X-Media-Key header + multipart: id, video  -> {success, url}
 *   (none) GET  ?f=<name>.mp4  streams that video (public, the name contains a random part), Range supported
 * Files live in domains/<site>/ig-media/, outside public_html.
 */
if (PHP_SAPI === 'cli') { exit("web only\n"); }
header('X-Robots-Tag: noindex, nofollow');

$home = getenv('EPHOD_HOME') ?: dirname(__DIR__, 2);          // domains/<site>/
$cfgFile = $home . '/ephod-config.local.php';
if (is_file($cfgFile)) require $cfgFile;
if (!defined('IG_MEDIA_KEY') || IG_MEDIA_KEY === '') { http_response_code(404); exit; }
define('IG_DIR', $home . '/ig-media');
if (!is_dir(IG_DIR)) @mkdir(IG_DIR, 0700, true);
$siteUrl = 'https://ephod4png.com';
$__sj = @json_decode(@file_get_contents(__DIR__ . '/site.json'), true);
if (!empty($__sj['url'])) $siteUrl = rtrim($__sj['url'], '/');
if (getenv('IG_MEDIA_SITE')) $siteUrl = rtrim(getenv('IG_MEDIA_SITE'), '/');

function fail($msg, $code = 400) { http_response_code($code); header('Content-Type: application/json'); echo json_encode(['success' => false, 'error' => $msg]); exit; }
function out($a) { header('Content-Type: application/json'); echo json_encode($a); exit; }

$action = $_GET['action'] ?? '';
if ($action === 'put') {
    header('Cache-Control: no-store');
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('POST only', 405);
    $k = $_SERVER['HTTP_X_MEDIA_KEY'] ?? '';
    if (!hash_equals(IG_MEDIA_KEY, $k)) fail('Wrong media key', 403);
    if (!$_POST && !$_FILES && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0)
        fail('The video is larger than this server accepts (post_max_size is ' . ini_get('post_max_size') . ', upload_max_filesize ' . ini_get('upload_max_filesize') . '). Raise both in hPanel, PHP Configuration.', 413);
    $id = (string)($_POST['id'] ?? '');
    if (!preg_match('/^[0-9a-z-]{3,60}$/', $id)) fail('Bad id');
    $f = $_FILES['video'] ?? null;
    if (!$f || $f['error'] !== UPLOAD_ERR_OK) fail('Upload failed (code ' . ($f['error'] ?? '?') . ')');
    if ($f['size'] > 100 * 1024 * 1024) fail('Video is larger than 100 MB');
    $head = file_get_contents($f['tmp_name'], false, null, 0, 12);
    if (substr($head, 4, 4) !== 'ftyp') fail('Not an MP4 file');
    $name = $id . '-' . bin2hex(random_bytes(8)) . '.mp4';      // the random part keeps the address unguessable
    $dest = IG_DIR . '/' . $name;
    if (!move_uploaded_file($f['tmp_name'], $dest)) { if (!@copy($f['tmp_name'], $dest)) fail('Could not store the video', 500); }
    foreach (glob(IG_DIR . '/*.mp4') ?: [] as $old) if ($old !== $dest && filemtime($old) < time() - 3 * 86400) @unlink($old);
    out(['success' => true, 'url' => $siteUrl . '/memoryverse/ig_media.php?f=' . rawurlencode($name), 'size' => (int)$f['size']]);
}

// ---------- public download ----------
$name = (string)($_GET['f'] ?? '');
if (!preg_match('/^[0-9a-z-]{3,60}-[0-9a-f]{16}\.mp4$/', $name)) { http_response_code(404); exit; }
$path = IG_DIR . '/' . $name;
if (!is_file($path)) { http_response_code(404); exit; }
$size = filesize($path); $start = 0; $end = $size - 1;
header('Content-Type: video/mp4');
header('Accept-Ranges: bytes');
header('Cache-Control: public, max-age=3600');
if (!empty($_SERVER['HTTP_RANGE']) && preg_match('/bytes=(\d*)-(\d*)/', $_SERVER['HTTP_RANGE'], $m)) {
    if ($m[1] !== '') { $start = (int)$m[1]; if ($m[2] !== '') $end = min((int)$m[2], $size - 1); }
    elseif ($m[2] !== '') { $start = max(0, $size - (int)$m[2]); }
    if ($start > $end || $start >= $size) { http_response_code(416); header("Content-Range: bytes */$size"); exit; }
    http_response_code(206);
    header("Content-Range: bytes $start-$end/$size");
}
header('Content-Length: ' . ($end - $start + 1));
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') exit;
$fh = fopen($path, 'rb'); fseek($fh, $start); $left = $end - $start + 1;
while ($left > 0 && !feof($fh)) { $chunk = fread($fh, min(1048576, $left)); if ($chunk === false) break; echo $chunk; $left -= strlen($chunk); flush(); }
fclose($fh);
