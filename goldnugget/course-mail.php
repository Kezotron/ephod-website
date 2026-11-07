<?php
// ============================================================
// EPHOD Seminars — automatic emails to learners (via Brevo)
//
// Runs once a day. For each learner who gave an email, decides
// which ONE message (if any) is due, sends it through Brevo, and
// records it so nobody gets the same message twice.
//
//   welcome    the day they save their email
//   seminar1   after Seminar 1
//   defined    after Seminar 5  (EPHOD Defined finished)
//   noun       after Seminar 9  (EPHOD the Noun finished)
//   complete   after Seminar 13 (certificate link)
//   nudge7 / nudge21 / nudge60   no activity for 7 / 21 / 60 days
//              (a fresh pause after new activity starts the nudges again)
//
// How it is run
//   Hostinger cron (daily):  curl -s "https://ephodlifestyle.com/memoryverse/course-mail.php?key=COURSE_KEY"
//   or on the server:        php course-mail.php
//   Dry run (nothing sent, just the plan):  add &dry=1   /  php course-mail.php --dry
//   Preview run: add &preview=1 / --preview — every email that is due today is sent to the
//     reviewers in COURSE_MAIL_PREVIEW_TO (not to the learner), marked "[Preview — would go to …]".
//   Until COURSE_MAIL_LIVE is true in ephod-config.local.php, EVERY run is a dry run.
//
// Messages: course-mail-templates.json (next to this file).
// Unsubscribe link: course-mail.php?unsub=1&e=<email>&t=<token>
// ============================================================
declare(strict_types=1);
require __DIR__ . '/config.php';

$cli = PHP_SAPI === 'cli';
$q = fn(string $k, $d = '') => $_GET[$k] ?? $d;

// ---------- unsubscribe (public link in every email) ----------
if (!$cli && $q('unsub') === '1') {
  header('Content-Type: text/html; charset=utf-8');
  $email = strtolower(trim((string)$q('e'))); $tok = (string)$q('t');
  $ok = $email !== '' && hash_equals(unsubToken($email), $tok);
  if ($ok) {
    try {
      $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); $db->set_charset('utf8mb4');
      $st = $db->prepare('UPDATE ' . T_COURSE . ' SET unsubscribed = 1 WHERE email = ?'); $st->bind_param('s', $email); $st->execute();
    } catch (Throwable $e) { $ok = false; }
  }
  echo '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>EPHOD Seminars</title><body style="font-family:sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;line-height:1.5">'
    . ($ok ? '<h1>You are unsubscribed</h1><p>We will not send any more course emails to <strong>' . htmlspecialchars($email) . '</strong>. Your progress in the seminars is still saved, and you are welcome back at any time: <a href="../seminars.html">ephodlifestyle.com/seminars.html</a>.</p>'
          : '<h1>That link did not work</h1><p>The unsubscribe link seems incomplete. Reply to any of our emails and we will take you off the list by hand.</p>')
    . '</body>';
  exit;
}

// ---------- who may run the job ----------
if (!$cli) {
  header('Content-Type: application/json; charset=utf-8'); header('Cache-Control: no-store');
  if (COURSE_KEY === '' || !hash_equals(COURSE_KEY, (string)$q('key'))) { http_response_code(403); echo json_encode(['success' => false, 'error' => COURSE_KEY === '' ? 'COURSE_KEY is not set in ephod-config.local.php' : 'Wrong key']); exit; }
}
$preview = $cli ? in_array('--preview', $argv ?? [], true) : $q('preview') === '1';
$dry = !$preview && (!COURSE_MAIL_LIVE || ($cli ? in_array('--dry', $argv ?? [], true) : $q('dry') === '1'));
$reviewers = array_values(array_filter(array_map('trim', explode(',', COURSE_MAIL_PREVIEW_TO)), fn($e) => filter_var($e, FILTER_VALIDATE_EMAIL)));
$limit = (int)($cli ? 200 : ($q('limit') ?: 200));   // never more than this many emails per run

function unsubToken(string $email): string { return substr(hash_hmac('sha256', 'unsub|' . $email, DB_PASS . '|ephod'), 0, 24); }

// ---------- data ----------
$TITLES = [1 => 'Purpose', 2 => 'Pattern', 3 => 'Plan', 4 => 'Process', 5 => 'Power', 6 => 'Magnify', 7 => 'Membership', 8 => 'Maturity', 9 => 'Ministry', 10 => 'Monitor', 11 => 'Management', 12 => 'Mission', 13 => 'Mabuhay'];
$SITE_URL = 'https://ephodlifestyle.com';
$tplFile = __DIR__ . '/course-mail-templates.json';
$T = json_decode((string)@file_get_contents($tplFile), true);
if (!is_array($T)) { $msg = 'course-mail-templates.json is missing or not valid JSON'; if ($cli) { fwrite(STDERR, "$msg\n"); exit(1); } echo json_encode(['success' => false, 'error' => $msg]); exit; }

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); $db->set_charset('utf8mb4');
$db->query('CREATE TABLE IF NOT EXISTS course_mail_log (id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) NOT NULL, event VARCHAR(60) NOT NULL, sent_at DATETIME NOT NULL, status VARCHAR(200) NOT NULL DEFAULT "", UNIQUE KEY ev (email, event)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$c = $db->query('SHOW COLUMNS FROM ' . T_COURSE . " LIKE 'unsubscribed'");
if ($c && $c->num_rows === 0) $db->query('ALTER TABLE ' . T_COURSE . ' ADD COLUMN unsubscribed TINYINT(1) NOT NULL DEFAULT 0');

$learners = []; $r = $db->query('SELECT email, name, done_count, completed_at, created_at, updated_at, last_seen, unsubscribed FROM ' . T_COURSE . ' ORDER BY last_seen DESC');
while ($x = $r->fetch_assoc()) $learners[] = $x;
$sent = []; $r = $db->query('SELECT email, event, sent_at, status FROM course_mail_log');
while ($x = $r->fetch_assoc()) $sent[$x['email']][$x['event']] = $x;

// ---------- decide what each learner is due ----------
$now = time();
$days = fn(string $dt) => (int)floor(($now - strtotime($dt . ' UTC')) / 86400);
$plan = []; $stale = []; $skipped = ['unsubscribed' => 0, 'nothing_due' => 0, 'recent_mail' => 0, 'stale_milestone' => 0];
foreach ($learners as $L) {
  if ((int)$L['unsubscribed']) { $skipped['unsubscribed']++; continue; }
  $done = (int)$L['done_count']; $log = $sent[$L['email']] ?? [];
  $has = fn(string $ev) => isset($log[$ev]) && in_array($log[$ev]['status'], ['sent', 'stale'], true);
  $lastMailDays = 999; foreach ($log as $ev => $x) if ($x['status'] === 'sent') $lastMailDays = min($lastMailDays, $days($x['sent_at']));
  $event = null;
  // milestones, highest first (someone who did five seminars in one day gets just the "defined" email)
  if ($done >= 13 && !$has('complete')) $event = 'complete';
  elseif ($done >= 9 && !$has('noun') && !$has('complete')) $event = 'noun';
  elseif ($done >= 5 && !$has('defined') && !$has('noun') && !$has('complete')) $event = 'defined';
  elseif ($done >= 1 && !$has('seminar1') && $done < 5) $event = 'seminar1';
  elseif ($done === 0 && !$has('welcome') && $days($L['created_at']) <= 3) $event = 'welcome';
  // a milestone is only worth celebrating while it is fresh: if they reached it more than a week ago
  // (the usual case for people who were already on the course when these emails started), record it
  // as 'stale' so it never sends, and let the nudges speak instead
  if ($event !== null && $days($L['updated_at']) > 7) {
    $stale[] = [$L['email'], $event]; $event = null;
  }
  // nudges: no activity for a while, course unfinished, no email in the last 3 days
  if ($event === null && $done < 13) {
    $idle = $days($L['updated_at']); $stamp = substr($L['updated_at'], 0, 10);   // a new pause → new event names
    foreach ([60 => 'nudge60', 21 => 'nudge21', 7 => 'nudge7'] as $d => $ev) {
      if ($idle >= $d && !$has("$ev:$stamp")) { $event = "$ev:$stamp"; break; }
    }
    if ($event !== null && $lastMailDays < 3) { $skipped['recent_mail']++; $event = null; }
  }
  if ($event === null) { $skipped['nothing_due']++; continue; }
  $plan[] = ['learner' => $L, 'event' => $event, 'template' => explode(':', $event)[0]];
  if (count($plan) >= $limit) break;
}

foreach ($stale as [$em, $ev]) {
  $skipped['stale_milestone']++;
  if (!$dry) { $st = $db->prepare('INSERT IGNORE INTO course_mail_log (email, event, sent_at, status) VALUES (?, ?, UTC_TIMESTAMP(), "stale")'); $st->bind_param('ss', $em, $ev); $st->execute(); }
}
// ---------- build and send ----------
function fill(string $s, array $v): string { return strtr($s, $v); }
function htmlBody(string $text, string $subject): string {
  $paras = preg_split("/\n\s*\n/", trim($text));
  $h = '';
  foreach ($paras as $p) {
    $p = htmlspecialchars($p, ENT_QUOTES, 'UTF-8');
    $p = preg_replace('~(https?://[^\s<]+)~', '<a href="$1" style="color:#6d2e8c">$1</a>', $p);
    $h .= '<p style="margin:0 0 1em">' . nl2br($p) . '</p>';
  }
  return '<!doctype html><html><body style="margin:0;padding:24px;background:#f3f5f8;font-family:Georgia,serif;color:#1b2432">'
    . '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px 32px;font-size:17px;line-height:1.55">'
    . '<p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6d2e8c">EPHOD Seminars</p>'
    . $h
    . '</div></body></html>';
}
function brevoSend(array $msg): array {
  $body = json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  $ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => "accept: application/json\r\napi-key: " . BREVO_API_KEY . "\r\ncontent-type: application/json\r\n", 'content' => $body, 'timeout' => 20, 'ignore_errors' => true]]);
  $r = @file_get_contents(BREVO_API_URL, false, $ctx);
  $status = $http_response_header[0] ?? 'no response';
  $j = json_decode((string)$r, true) ?: [];
  $ok = str_contains($status, ' 201') || str_contains($status, ' 200');
  return [$ok, $ok ? 'sent' : ('failed: ' . $status . ' ' . substr((string)($j['message'] ?? $r), 0, 120))];
}

$results = [];
foreach ($plan as $p) {
  $L = $p['learner']; $tpl = $T[$p['template']] ?? null;
  if (!$tpl || empty($tpl['subject']) || empty($tpl['text'])) { $results[] = ['email' => $L['email'], 'event' => $p['event'], 'status' => 'no template']; continue; }
  $done = (int)$L['done_count']; $nextN = min(13, $done + 1);
  $first = trim(explode(' ', trim($L['name']))[0] ?? ''); if ($first === '') $first = 'friend';
  $vars = [
    '{first}' => $first, '{name}' => $L['name'] !== '' ? $L['name'] : 'friend', '{done}' => (string)$done,
    '{next_n}' => (string)$nextN, '{next_title}' => $TITLES[$nextN], '{next_url}' => "$SITE_URL/seminar.html?n=$nextN",
    '{course_url}' => "$SITE_URL/seminars.html", '{certificate_url}' => "$SITE_URL/certificate.html",
    '{unsubscribe_url}' => "$SITE_URL/memoryverse/course-mail.php?unsub=1&e=" . rawurlencode($L['email']) . '&t=' . unsubToken($L['email']),
  ];
  $subject = fill($tpl['subject'], $vars); $text = fill($tpl['text'], $vars);
  if (!str_contains($tpl['text'], '{unsubscribe_url}')) $text .= "\n\n—\nYou are receiving this because you saved your progress in the EPHOD Seminars with this email. To stop these emails: " . $vars['{unsubscribe_url}'];
  $msg = ['sender' => ['name' => MAIL_FROM_NAME, 'email' => MAIL_FROM_EMAIL], 'to' => [['email' => $L['email'], 'name' => $L['name'] ?: $L['email']]], 'replyTo' => ['email' => MAIL_REPLY_TO], 'subject' => $subject, 'textContent' => $text, 'htmlContent' => htmlBody($text, $subject), 'tags' => ['ephod-seminars', $p['template']]];
  if ($dry) { $results[] = ['email' => $L['email'], 'name' => $L['name'], 'event' => $p['event'], 'subject' => $subject, 'status' => 'DRY RUN — not sent', 'preview' => mb_substr($text, 0, 160) . '…']; continue; }
  if (BREVO_API_KEY === '') { $results[] = ['email' => $L['email'], 'event' => $p['event'], 'status' => 'BREVO_API_KEY not set']; continue; }
  if ($preview) {
    if (!$reviewers) { $results[] = ['email' => $L['email'], 'event' => $p['event'], 'status' => 'COURSE_MAIL_PREVIEW_TO has no valid address']; continue; }
    $note = "[Preview \u2014 this email would go to " . ($L['name'] !== '' ? $L['name'] . ' <' . $L['email'] . '>' : $L['email']) . "]";
    $pm = $msg; $pm['subject'] = '[Preview] ' . $subject; $pm['textContent'] = $note . "\n\n" . $text; $pm['htmlContent'] = htmlBody($note . "\n\n" . $text, $subject);
    $pm['to'] = array_map(fn($e) => ['email' => $e], $reviewers); $pm['tags'] = ['ephod-seminars', 'preview'];
    [$ok, $status] = brevoSend($pm);
    $results[] = ['email' => $L['email'], 'name' => $L['name'], 'event' => $p['event'], 'subject' => $subject, 'status' => ($ok ? 'preview sent to ' . implode(', ', $reviewers) : $status)];
    continue;   // previews are not logged, so the real email still goes out when the job runs live
  }
  [$ok, $status] = brevoSend($msg);
  $st = $db->prepare('INSERT INTO course_mail_log (email, event, sent_at, status) VALUES (?, ?, UTC_TIMESTAMP(), ?) ON DUPLICATE KEY UPDATE sent_at = VALUES(sent_at), status = VALUES(status)');
  $st->bind_param('sss', $L['email'], $p['event'], $status); $st->execute();
  $results[] = ['email' => $L['email'], 'event' => $p['event'], 'subject' => $subject, 'status' => $status];
}

$out = ['success' => true, 'mode' => $preview ? 'preview (copies to reviewers only)' : ($dry ? (COURSE_MAIL_LIVE ? 'dry run (asked for)' : 'dry run (COURSE_MAIL_LIVE is not true yet)') : 'live'), 'learners' => count($learners), 'due' => count($plan), 'skipped' => $skipped, 'from' => MAIL_FROM_NAME . ' <' . MAIL_FROM_EMAIL . '>', 'brevo_key' => BREVO_API_KEY === '' ? 'missing' : 'set', 'results' => $results];
if ($cli) { foreach ($results as $x) echo str_pad($x['status'], 28) . ' ' . str_pad($x['event'], 20) . ' ' . $x['email'] . "\n"; echo 'Mode: ' . $out['mode'] . " — learners {$out['learners']}, due {$out['due']}\n"; }
else echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
