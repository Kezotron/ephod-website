<?php
// Tiny environment check for the entry pages (safe to leave; reveals no secrets)
header('Content-Type: text/plain');
echo "PHP ", PHP_VERSION, "\n";
echo "GD: ", function_exists('imagewebp') ? "yes (webp)" : (function_exists('imagecreatefromjpeg') ? "yes (no webp)" : "NO"), "\n";
echo "mysqli: ", class_exists('mysqli') ? "yes" : "NO", "\n";
$f = dirname(__DIR__, 2) . '/ephod-config.local.php';
echo "password file: ", is_file($f) ? "found" : "missing", "\n";
if (is_file($f)) { try { include $f; echo "password file parses: ", defined('DB_PASS') && DB_PASS !== '' ? "yes, DB_PASS set" : "parses but DB_PASS empty", "\n"; } catch (Throwable $e) { echo "password file ERROR: ", $e->getMessage(), "\n"; } }
try { include __DIR__ . '/api.php'; } catch (Throwable $e) { echo "api.php ERROR: ", get_class($e), ": ", $e->getMessage(), " (line ", $e->getLine(), ")\n"; }
