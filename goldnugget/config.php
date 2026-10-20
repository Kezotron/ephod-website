<?php
// ============================================================
// EPHOD entry pages — configuration
// Fill in the database password after uploading. This file is
// blocked from the web by .htaccess; keep it that way.
// ============================================================

// The database password lives in a small file that is NOT in Git:
//   <?php define('DB_PASS', 'the-password');
// Put it OUTSIDE public_html so GitHub deploys can't remove it and the web can't read it:
//   domains/<site>/ephod-config.local.php   (next to public_html)
// A config.local.php next to this file still works too.
foreach ([dirname(__DIR__, 2) . '/ephod-config.local.php', __DIR__ . '/config.local.php'] as $__f) {
  if (is_file($__f)) { require $__f; break; }
}
define('DB_HOST', 'localhost');
define('DB_NAME', 'u663280063_youtube');
define('DB_USER', 'u663280063_youtube');
if (!defined('DB_PASS')) define('DB_PASS', '');

// Absolute path of the website's public folder (where index.html lives).
// On Hostinger this is usually: /home/uNNNNNNNNN/domains/ephodlifestyle.com/public_html
define('SITE_ROOT', dirname(__DIR__));

// Table names (exactly as they are in the database)
define('T_MEMORY', 'memory_verse');
define('T_NUGGET', 'goldennugget');
define('T_DEVOTIONS', 'devotions');
define('T_BOOKS', 'biblebooks');
define('T_VERSIONS', 'bible_version_key');

// Versions offered in the entry pages (table => label). Order matters.
$ENTRY_VERSIONS = [
  'bibledb_kjv'        => 'King James Version',
  't_asv'              => 'American Standard Version',
  't_web'              => 'World English Bible',
  't_bbe'              => 'Bible in Basic English',
  't_dby'              => 'Darby Translation',
  't_niv'              => 'New International Version',
  'bible_verses_tagab' => 'Ang Dating Biblia (Tagalog)',
  'p_tok'              => 'Buk Baibel long Tok Pisin',
];
