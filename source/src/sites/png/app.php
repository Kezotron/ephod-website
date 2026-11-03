<?php
// ephod4png.com/app — the address in the printed EPHOD PNG QR code.
// Sends each phone straight to its own store; anything else gets the apps page.
// To change where the QR code goes, edit these three lines (the printed codes keep working).
$PLAY  = 'https://play.google.com/store/apps/details?id=com.ephod4png.ephod';
$APPLE = 'https://apps.apple.com/us/app/ephod-png/id6757665939';
$OTHER = '/apps.html';

$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (stripos($ua, 'Android') !== false) $to = $PLAY;
elseif (preg_match('/iPhone|iPad|iPod/i', $ua)) $to = $APPLE;
else $to = $OTHER;
header('Cache-Control: no-store');
header('Location: ' . $to, true, 302);
exit;
