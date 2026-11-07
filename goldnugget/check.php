<?php
// Tiny environment check for the entry pages (safe to leave; reveals no secrets)
header('Content-Type: text/plain');
echo "PHP ", PHP_VERSION, "\n";
echo "GD: ", function_exists('imagewebp') ? "yes (webp)" : (function_exists('imagecreatefromjpeg') ? "yes (no webp)" : "NO"), "\n";
echo "mysqli: ", class_exists('mysqli') ? "yes" : "NO", "\n";
$f = dirname(__DIR__, 2) . '/ephod-config.local.php';
echo "password file: ", is_file($f) ? "found" : "missing", "\n";
if (is_file($f)) { try { include $f; echo "password file parses: ", defined('DB_PASS') && DB_PASS !== '' ? "yes, DB_PASS set" : "parses but DB_PASS empty", "\n"; } catch (Throwable $e) { echo "password file ERROR: ", $e->getMessage(), "\n"; } }
$f2 = __DIR__ . '/config.local.php';
echo "config.local.php inside public_html: ", is_file($f2) ? "found (NOT used when the outside file exists — put the course lines in the outside file)" : "none", "\n";
echo "the file being read is: ", is_file($f) ? $f : (is_file($f2) ? $f2 : 'none'), "\n";
foreach (['COURSE_KEY', 'BREVO_API_KEY', 'COURSE_MAIL_PREVIEW_TO', 'MAIL_FROM_EMAIL', 'COURSE_MAIL_LIVE'] as $c) {
  echo "$c: ", defined($c) ? (in_array($c, ['COURSE_KEY', 'BREVO_API_KEY'], true) ? (constant($c) === '' ? 'defined but EMPTY' : 'set (' . strlen((string)constant($c)) . ' characters)') : var_export(constant($c), true)) : 'NOT defined', "\n";
}
if (is_file($f)) { echo "password file size: ", filesize($f), " bytes, last modified ", date('Y-m-d H:i:s T', filemtime($f)), " (server clock now ", date('Y-m-d H:i:s T'), ")\n"; $raw = (string)@file_get_contents($f); echo "line endings: ", str_contains($raw, "\r\n") ? 'CRLF' : (str_contains($raw, "\r") ? 'CR only' : (str_contains($raw, "\n") ? 'LF' : 'none')), "; starts with: ", json_encode(substr($raw, 0, 12)), "\n"; }
clearstatcache(); $pd = dirname($f); echo "files next to it in ", $pd, ": ", implode(', ', array_values(array_diff(scandir($pd) ?: [], ['.', '..']))), "\n";
if (is_file($f)) { $lines = @file($f) ?: []; echo "password file has ", count($lines), " lines; defines found: ", implode(', ', array_map(fn($l) => preg_match("/define\\(\\s*'([A-Z_]+)'/", $l, $m) ? $m[1] : '?', array_filter($lines, fn($l) => str_contains($l, 'define(')))), "\n"; }
try { include __DIR__ . '/api.php'; } catch (Throwable $e) { echo "api.php ERROR: ", get_class($e), ": ", $e->getMessage(), " (line ", $e->getLine(), ")\n"; }
