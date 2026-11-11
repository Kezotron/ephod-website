<?php
/**
 * Daily Gold Nugget story trigger — runs on the ephod4png.com server from a Hostinger cron job.
 *
 * Each site has its own windows (see SITES below). At the first cron run after a window opens, it reads today's
 * content from this site and starts the GitHub workflow "Daily Gold Nugget stories (Facebook)" for that language,
 * handing the content over so GitHub never has to reach the website. Safe to run every hour: it remembers
 * what it has already started today.
 *
 * Needs in domains/<site>/ephod-config.local.php:
 *     define('GITHUB_DISPATCH_TOKEN', '...');   // fine-grained token, this repo only, Actions: read & write
 *
 * hPanel cron (Advanced → Cron Jobs, type Custom), every hour, one per site:
 *     /usr/bin/php /home/<account>/domains/ephod4png.com/public_html/memoryverse/story_trigger.php 2>&1
 *     /usr/bin/php /home/<account>/domains/ephodlifestyle.com/public_html/memoryverse/story_trigger.php 2>&1
 *
 * Source: source/src/admin/story_trigger.php (build.py copies it to memoryverse/ on both sites; only PNG has the cron).
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("cron only\n"); }

const REPO = 'Kezotron/ephod-social';
const WORKFLOW = 'daily-story.yml';
// The site this copy runs on (memoryverse/site.json is written by build.py)
$__site = @json_decode(@file_get_contents(__DIR__ . '/site.json'), true);
define('SITE', rtrim($__site['url'] ?? 'https://ephod4png.com', '/'));
// Per site: Facebook page key for the workflow, time zone, and story => earliest hour (local time)
const SITES = [
    'ephod4png.com'      => ['page' => 'png', 'tz' => 'Pacific/Port_Moresby', 'windows' => ['tp' => 7, 'en' => 18]],
    'ephodlifestyle.com' => ['page' => 'ph',  'tz' => 'Asia/Manila',          'windows' => ['tl' => 6, 'en' => 20]],
];
$__host = parse_url(SITE, PHP_URL_HOST);
if (!isset(SITES[$__host])) fail("no story windows configured for $__host");
define('PAGE', SITES[$__host]['page']); define('TZ', SITES[$__host]['tz']); define('WINDOWS', SITES[$__host]['windows']);

$home = dirname(__DIR__, 2);                     // domains/<site>/
$cfg = $home . '/ephod-config.local.php';
$state = $home . '/story-trigger.json';
if (!is_file($cfg)) fail("config file not found: $cfg");
require $cfg;
if (!defined('GITHUB_DISPATCH_TOKEN') || GITHUB_DISPATCH_TOKEN === '') fail("GITHUB_DISPATCH_TOKEN is not set in $cfg");

$now = new DateTime('now', new DateTimeZone(TZ));
$today = $now->format('Y-m-d');
$hour = (int)$now->format('G');
$st = is_file($state) ? json_decode(file_get_contents($state), true) : [];
$due = [];
foreach (WINDOWS as $lang => $after) {
    if ($hour >= $after && ($st[$lang] ?? '') !== $today) $due[] = $lang;
}
if (!$due) done("nothing due at $hour:00 " . TZ . " (" . implode(', ', array_map(fn($l) => "$l " . ($st[$l] ?? '-'), array_keys(WINDOWS))) . ")");
$lang = $due[0];                                 // one run per cron call; a second due story goes next hour

// Today's content from this site (same feed the weekly post uses)
$body = http('GET', SITE . '/memoryverse/api.php?action=social_content', null, []);
$c = json_decode($body, true);
if (!is_array($c) || empty($c['success'])) fail("content feed did not answer properly: " . substr($body, 0, 200));
if (empty($c['goldNugget']['tokPisin']) && empty($c['goldNugget']['text'])) fail("no Gold Nugget in today's feed");
if (($c['date'] ?? '') !== $today) {
    // The feed is on Manila time; PNG is 2 hours ahead, so by 7 am PNG both are on the same date. Anything else is wrong.
    fail("feed date {$c['date']} does not match today in PNG ($today)");
}
unset($c['devotion']);                           // keep the hand-over small: the stories need only the nugget
$payload = json_encode(['ref' => 'main', 'inputs' => [
    'content' => json_encode($c, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    'source'  => 'hostinger',
    'lang'    => $lang,
    'page'    => PAGE,
]]);

// Start the GitHub workflow
$r = http('POST', 'https://api.github.com/repos/' . REPO . '/actions/workflows/' . WORKFLOW . '/dispatches', $payload, [
    'Authorization: Bearer ' . GITHUB_DISPATCH_TOKEN,
    'Accept: application/vnd.github+json',
    'X-GitHub-Api-Version: 2022-11-28',
    'Content-Type: application/json',
], $code);
if ($code !== 204) fail("GitHub refused the start request (HTTP $code): " . substr($r, 0, 300));

$st[$lang] = $today; $st['last'] = $now->format('c') . " $lang " . ($c['goldNugget']['reference'] ?? '');
file_put_contents($state, json_encode($st));
done("started the GitHub run for the $lang story, $today (" . ($c['goldNugget']['reference'] ?? '') . ")");

function http($method, $url, $body, $headers, &$code = null) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 40, CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => array_merge(['User-Agent: EPHOD-story-trigger/1.0'], $headers),
        CURLOPT_CUSTOMREQUEST => $method,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $out = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    if ($out === false) fail("$method $url failed: " . curl_error($ch));
    return $out;
}
function done($msg) { echo date('c') . " story_trigger: $msg\n"; exit(0); }
function fail($msg) { echo date('c') . " story_trigger ERROR: $msg\n"; exit(1); }
