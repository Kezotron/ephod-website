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
define('T_COURSE', 'course_progress');   // EPHOD Seminars online course: progress by email
// EPHOD Seminars course — set these in ephod-config.local.php (never here; this file is public on GitHub):
//   define('COURSE_KEY', 'a-password-you-choose');   // opens the learners page and lets the cron job run the mail
//   define('BREVO_API_KEY', 'xkeysib-…');            // Brevo → SMTP & API → API keys
//   define('COURSE_MAIL_LIVE', true);                // until this is true the mail job only reports what it WOULD send
//   define('MAIL_FROM_EMAIL', 'seminars@ephodlifestyle.com');  define('MAIL_FROM_NAME', 'Herb and Karen Johnson');  define('MAIL_REPLY_TO', 'kevin@ephodlifestyle.com');
//   define('COURSE_MAIL_PREVIEW_TO', 'kevin@…, herb@…, karen@…');   // who receives preview copies
if (!defined('COURSE_KEY')) define('COURSE_KEY', '');
if (!defined('BREVO_API_KEY')) define('BREVO_API_KEY', '');
if (!defined('BREVO_API_URL')) define('BREVO_API_URL', 'https://api.brevo.com/v3/smtp/email');
if (!defined('COURSE_MAIL_LIVE')) define('COURSE_MAIL_LIVE', false);
if (!defined('MAIL_FROM_EMAIL')) define('MAIL_FROM_EMAIL', 'seminars@ephodlifestyle.com');
if (!defined('MAIL_FROM_NAME')) define('MAIL_FROM_NAME', 'Herb and Karen Johnson');
if (!defined('MAIL_REPLY_TO')) define('MAIL_REPLY_TO', 'kevin@ephodlifestyle.com');
if (!defined('COURSE_MAIL_PREVIEW_TO')) define('COURSE_MAIL_PREVIEW_TO', MAIL_REPLY_TO);   // comma-separated reviewers who get preview copies (course-mail.php?preview=1)
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
