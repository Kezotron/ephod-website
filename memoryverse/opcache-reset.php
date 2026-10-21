<?php
// Clears PHP's compiled-code cache after a deploy, so new api.php code is used immediately.
header('Content-Type: text/plain');
if (function_exists('opcache_reset')) { echo opcache_reset() ? "opcache reset\n" : "opcache reset failed\n"; } else { echo "opcache not available\n"; }
clearstatcache(true);
echo "PHP ", PHP_VERSION, "\n";
