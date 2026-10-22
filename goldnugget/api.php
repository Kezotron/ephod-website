<?php
// ============================================================
// EPHOD entry pages — one small API for all three pages
// (memory verse, Gold Nugget, devotions). Same-origin only.
// ============================================================
declare(strict_types=1);
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out(array $a): void { echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail(string $m, int $code = 400): void { http_response_code($code); out(['success' => false, 'error' => $m]); }

// Only accept requests from our own pages
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $src = $origin ?: $referer;
  if ($src) {
    $u = parse_url($src); $srcHost = ($u['host'] ?? '') . (isset($u['port']) ? ':' . $u['port'] : '');
    if (strcasecmp($srcHost, $host) !== 0) fail('Cross-site request refused', 403);
  }
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  $db->set_charset('utf8mb4');
} catch (Throwable $e) {
  // ?action=db_check explains the failure without revealing secrets
  if (($_GET['action'] ?? '') === 'db_check') {
    $msg = $e->getMessage();
    $why = 'unknown';
    $__outside = dirname(__DIR__, 2) . '/ephod-config.local.php';
    if (!is_file(__DIR__ . '/config.local.php') && !is_file($__outside)) $why = 'No password file found. Create ' . $__outside . ' (outside public_html) containing: <?php define(\'DB_PASS\', \'the-password\');';
    elseif (DB_PASS === '') $why = 'config.local.php exists but DB_PASS is empty';
    elseif (stripos($msg, 'Access denied') !== false) $why = 'MySQL refused the user/password (Access denied) — wrong password, or this website is on a different hosting plan than the database';
    elseif (stripos($msg, 'Unknown database') !== false) $why = 'MySQL connected but the database name does not exist on this server';
    elseif (stripos($msg, 'refused') !== false || stripos($msg, 'No such file') !== false || stripos($msg, 'getaddrinfo') !== false || stripos($msg, "Can't connect") !== false) $why = 'No MySQL server reachable at DB_HOST from this website — use the Remote MySQL hostname of the plan that owns the database';
    out(['success' => false, 'connected' => false, 'why' => $why, 'mysql_error' => (DB_PASS === '' ? $msg : str_replace(DB_PASS, '***', $msg)), 'host' => DB_HOST, 'database' => DB_NAME, 'user' => DB_USER, 'password_file' => (is_file($__outside) ? 'ephod-config.local.php (outside public_html)' : (is_file(__DIR__ . '/config.local.php') ? 'config.local.php (inside public_html; deploys may delete it)' : 'none')), 'php' => PHP_VERSION, 'looked_in' => [dirname(__DIR__, 2), __DIR__], 'files_there' => [basename(dirname(__DIR__, 2)) => array_values(array_diff(scandir(dirname(__DIR__, 2)) ?: [], ['.', '..'])), basename(__DIR__) => array_values(array_filter(array_diff(scandir(__DIR__) ?: [], ['.', '..']), fn($f) => str_contains($f, 'config')))]]);
  }
  fail('Database connection failed. Check config.php.', 500);
}
if (($_GET['action'] ?? '') === 'db_check') {
  $r = $db->query('SELECT DATABASE() AS d, VERSION() AS v');
  $row = $r ? $r->fetch_assoc() : [];
  $tables = [];
  foreach ([T_MEMORY, T_NUGGET, T_DEVOTIONS, 'biblebooks', 'bible_version_key'] as $t) {
    $q = $db->query("SHOW TABLES LIKE '" . $db->real_escape_string($t) . "'");
    $tables[$t] = $q && $q->num_rows > 0;
  }
  out(['success' => true, 'connected' => true, 'database' => $row['d'] ?? null, 'mysql' => $row['v'] ?? null, 'tables' => $tables, 'php' => PHP_VERSION]);
}

$action = $_GET['action'] ?? '';
$input = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $raw = file_get_contents('php://input');
  if (!empty($_POST)) $input = $_POST; elseif ($raw) $input = json_decode($raw, true) ?: [];
}
$q = fn(string $k, $d = null) => $input[$k] ?? $_GET[$k] ?? $d;

function versionTable(mysqli $db, string $v): string {
  global $ENTRY_VERSIONS;
  if (!preg_match('/^[a-zA-Z0-9_]+$/', $v)) fail('Bad version');
  $st = $db->prepare('SELECT `table` FROM ' . T_VERSIONS . ' WHERE `table` = ?');
  $st->bind_param('s', $v); $st->execute();
  if (!$st->get_result()->fetch_assoc() && !isset($ENTRY_VERSIONS[$v])) fail('Unknown version');
  return $v;
}
function bookId(mysqli $db, string $b): string {
  $st = $db->prepare('SELECT id FROM ' . T_BOOKS . ' WHERE id = ?');
  $st->bind_param('s', $b); $st->execute();
  if (!$st->get_result()->fetch_assoc()) fail('Unknown book');
  return $b;
}
function fetchVerses(mysqli $db, string $table, string $book, int $ch, int $v1, int $v2): array {
  $sql = $v2 > $v1
    ? "SELECT VERSENO, VERSETEXT FROM `$table` WHERE BOOKID = ? AND CHAPTERNO = ? AND CAST(VERSENO AS UNSIGNED) BETWEEN ? AND ? ORDER BY CAST(VERSENO AS UNSIGNED)"
    : "SELECT VERSENO, VERSETEXT FROM `$table` WHERE BOOKID = ? AND CHAPTERNO = ? AND CAST(VERSENO AS UNSIGNED) = ? ORDER BY CAST(VERSENO AS UNSIGNED)";
  $st = $db->prepare($sql);
  if ($v2 > $v1) $st->bind_param('siii', $book, $ch, $v1, $v2); else $st->bind_param('sii', $book, $ch, $v1);
  $st->execute(); $r = $st->get_result(); $o = [];
  while ($row = $r->fetch_assoc()) $o[] = ['number' => (int)$row['VERSENO'], 'text' => $row['VERSETEXT']];
  return $o;
}
function slugify(string $s): string {
  $s = strtolower(trim($s)); $s = str_replace(["\u{2019}", "\u{2018}", "'", "\u{201C}", "\u{201D}", '"'], '', $s);   // apostrophes vanish, as WordPress does
  $s = preg_replace('/[^a-z0-9]+/', '-', $s); return trim($s, '-') ?: 'devotion';
}
function sanitizeHtml(string $h): string {
  $h = strip_tags($h, '<p><br><strong><b><em><i><a><ul><ol><li><h3><blockquote>');
  $h = preg_replace('/<(\w+)[^>]*?(\s(on\w+|style|class|id)=("[^"]*"|\'[^\']*\'))+[^>]*>/i', '<$1>', $h);
  $h = preg_replace('/\s(on\w+|style|class|id)=("[^"]*"|\'[^\']*\')/i', '', $h);
  $h = preg_replace('/<a\s+[^>]*href=(["\'])(?!https?:)[^"\']*\1[^>]*>/i', '<a>', $h);
  $h = str_ireplace(['<b>', '</b>', '<i>', '</i>'], ['<strong>', '</strong>', '<em>', '</em>'], $h);
  $h = preg_replace('/<p>(\s|&nbsp;)*<\/p>/', '', $h);
  $h = preg_replace('/<div[^>]*>|<\/div>/', '', $h);
  return trim($h);
}
function excerptOf(string $html): string {
  $t = trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags(preg_replace('#</(p|li|h3|blockquote|div)>#i', ' ', $html)), ENT_QUOTES, 'UTF-8')));
  if (mb_strlen($t) <= 200) return $t;
  $t = mb_substr($t, 0, 200); return mb_substr($t, 0, mb_strrpos($t, ' ') ?: 200) . '…';
}
function rebuildDevotionFiles(mysqli $db, ?string $changedSlug = null): int {
  $dir = SITE_ROOT . '/data/devotions';
  if (!is_dir($dir) && !mkdir($dir, 0755, true)) fail('Cannot create data/devotions folder', 500);
  $r = $db->query('SELECT slug, title, post_date, reading, image, excerpt, body, (image_data IS NOT NULL) AS has_blob FROM ' . T_DEVOTIONS . ' WHERE published = 1 ORDER BY post_date DESC, id DESC');
  $index = []; $all = []; $keep = ['index.json' => 1, 'all.json' => 1]; $restored = 0;
  while ($row = $r->fetch_assoc()) {
    if ($row['image'] && $row['has_blob'] && !is_file(SITE_ROOT . '/' . $row['image'])) {
      $st = $db->prepare('SELECT image_data FROM ' . T_DEVOTIONS . ' WHERE slug = ?'); $st->bind_param('s', $row['slug']); $st->execute(); $blob = $st->get_result()->fetch_assoc()['image_data'] ?? null;
      if ($blob) { $idir = dirname(SITE_ROOT . '/' . $row['image']); if (!is_dir($idir)) mkdir($idir, 0755, true); file_put_contents(SITE_ROOT . '/' . $row['image'], $blob); $restored++; }
    }
    $rec = ['slug' => $row['slug'], 'title' => $row['title'], 'date' => $row['post_date'], 'reading' => $row['reading'], 'image' => $row['image'] ?: null, 'excerpt' => $row['excerpt'], 'body' => $row['body']];
    $index[] = array_diff_key($rec, ['body' => 1]); $all[] = $rec;
    file_put_contents("$dir/{$row['slug']}.json", json_encode($rec, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    $keep[$row['slug'] . '.json'] = 1;
  }
  file_put_contents("$dir/index.json", json_encode($index, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  file_put_contents("$dir/all.json", json_encode($all, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  foreach (glob("$dir/*.json") as $f) if (!isset($keep[basename($f)])) unlink($f); // unpublished/renamed
  $GLOBALS['restoredImages'] = $restored;
  writeDevotionPages($all, $changedSlug);
  return count($index);
}

// ---- one real HTML page per devotion (/devotion/<slug>.html) + sitemap-devotions.xml ----
// Search engines read these directly: own title, description, share photo and Article data.
// Template: memoryverse/devotion-template.html, produced by build.py from the site layout.
function devoWeek(string $date): array {
  $ts = strtotime($date . ' 12:00:00'); $dow = (int)date('w', $ts); $add = ((8 - $dow) % 7) ?: 7;
  $start = strtotime("+$add days", $ts); return [$start, strtotime('+6 days', $start)];
}
function writeDevotionPages(array $all, ?string $changedSlug = null): void {
  $tplFile = __DIR__ . '/devotion-template.html'; $siteFile = __DIR__ . '/site.json';
  if (!is_file($tplFile) || !is_file($siteFile)) return; // older build: nothing to do
  $tpl = file_get_contents($tplFile); $site = json_decode(file_get_contents($siteFile), true);
  $base = rtrim($site['url'], '/'); $dir = SITE_ROOT . '/devotion';
  if (!is_dir($dir) && !mkdir($dir, 0755, true)) return;
  $h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
  $keep = []; $sitemap = '';
  foreach ($all as $i => $d) {
    [$ws, $we] = devoWeek($d['date']);
    $range = date('F j', $ws) . ' to ' . date('F j', $we) . ', ' . date('Y', $we);
    $newer = $i > 0 ? $all[$i - 1] : null; $older = $i < count($all) - 1 ? $all[$i + 1] : null;
    $desc = trim(preg_replace('/\s+/', ' ', (string)$d['excerpt']));
    if (mb_strlen($desc) > 155) { $desc = mb_substr($desc, 0, 155); $desc = mb_substr($desc, 0, mb_strrpos($desc, ' ') ?: 155) . '…'; }
    $desc = ($d['reading'] ? 'Devotion on ' . $d['reading'] . '. ' : '') . $desc;
    $img = $d['image'] ? "$base/" . ltrim($d['image'], '/') : "$base/images/og-ephod.jpg";
    $article = ($d['image'] ? '<div class="article-hero"><img src="../' . $h(ltrim($d['image'], '/')) . '" alt="" onerror="this.parentNode.remove()"></div>' : '')
      . '<p class="meta">Week of ' . $h($range) . '</p>'
      . '<h1>' . $h($d['title']) . '</h1>'
      . ($d['reading'] ? '<p class="read-line">Read ' . $h($d['reading']) . '</p>' : '')
      . '<div class="article-body">' . $d['body'] . '</div>'
      . '<p class="copyright-note">© Gospel Publishing House, 1445 N. Boonville Ave., Springfield, Missouri 65802. Used by permission.</p>'
      . '<nav class="article-nav" aria-label="More devotions"><span>'
      . ($older ? '<a href="' . $h($older['slug']) . '.html" rel="prev"><span class="lbl">Older</span>← ' . $h($older['title']) . '</a>' : '')
      . '</span><span>'
      . ($newer ? '<a href="' . $h($newer['slug']) . '.html" rel="next" style="text-align:right"><span class="lbl">Newer</span>' . $h($newer['title']) . ' →</a>' : '')
      . '</span></nav>';
    $ld = ['@context' => 'https://schema.org', '@type' => 'Article', 'headline' => $d['title'],
      'description' => $desc, 'image' => $img, 'datePublished' => date('Y-m-d', $ws), 'dateModified' => $d['date'],
      'url' => "$base/devotion/{$d['slug']}.html", 'mainEntityOfPage' => "$base/devotion/{$d['slug']}.html",
      'isAccessibleForFree' => true, 'inLanguage' => 'en', 'about' => $d['reading'] ?: 'Bible reading',
      'author' => ['@type' => 'Organization', 'name' => 'Gospel Publishing House'],
      'publisher' => ['@type' => 'Organization', 'name' => 'EPHOD Discipleship', 'url' => 'https://ephodlifestyle.com/', 'logo' => ['@type' => 'ImageObject', 'url' => 'https://ephodlifestyle.com/images/ephod-banner-1200.webp']],
      'isPartOf' => ['@type' => 'WebSite', 'name' => $site['name'], 'url' => "$base/"]];
    $page = strtr($tpl, ['%%TITLE%%' => $h($d['title'] . ' — Devotions | ' . $site['name']), '%%DESCRIPTION%%' => $h($desc),
      '%%SLUG%%' => $h($d['slug']), '%%IMAGE%%' => $h($img), '%%DATE%%' => $h($d['date']), '%%READING%%' => $h($d['reading']),
      '%%ARTICLE%%' => $article, '%%JSONLD%%' => '  <script type="application/ld+json">' . json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "</script>\n"]);
    file_put_contents("$dir/{$d['slug']}.html", $page); $keep[$d['slug'] . '.html'] = 1;
    $sitemap .= "<url><loc>$base/devotion/{$d['slug']}.html</loc><lastmod>" . date('Y-m-d', $ws) . "</lastmod></url>\n";
  }
  foreach (glob("$dir/*.html") as $f) if (!isset($keep[basename($f)])) unlink($f);
  file_put_contents(SITE_ROOT . '/sitemap-devotions.xml', "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n$sitemap</urlset>\n");
  // Tell the search engines (IndexNow: Bing, DuckDuckGo, Yahoo, Yandex) which pages changed.
  // A save: that devotion, the Devotions list and the home page. A full rebuild: every devotion.
  $changed = $changedSlug ?? ($_GET['slug'] ?? null);
  if ($changed !== null && $changed !== '') $urls = ["$base/devotion/" . rawurlencode($changed) . ".html", "$base/devotions.html", "$base/"];
  else $urls = array_merge(["$base/", "$base/devotions.html"], array_map(fn($d) => "$base/devotion/{$d['slug']}.html", $all));
  indexNow($site, $urls);
  // The other EPHOD site shares this database: ask it to rebuild its own copies too (best effort, 8 s).
  if (empty($_GET['from_peer'])) {
    foreach ($site['peer'] ?? [] as $peer) {
      $ctx = stream_context_create(['http' => ['timeout' => 8, 'ignore_errors' => true]]);
      @file_get_contents(rtrim($peer, '/') . '/memoryverse/api.php?action=devo_rebuild&from_peer=1' . ($changed ? '&slug=' . rawurlencode($changed) : ''), false, $ctx);
    }
  }
}
function indexNow(array $site, array $urls): void {
  $key = $site['indexnow_key'] ?? ''; if ($key === '' || !$urls) return;
  if (!is_file(SITE_ROOT . "/$key.txt")) return; // key file not deployed yet
  $host = parse_url($site['url'], PHP_URL_HOST);
  $body = json_encode(['host' => $host, 'key' => $key, 'keyLocation' => rtrim($site['url'], '/') . "/$key.txt", 'urlList' => array_values(array_unique($urls))], JSON_UNESCAPED_SLASHES);
  $ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => "Content-Type: application/json; charset=utf-8\r\n", 'content' => $body, 'timeout' => 8, 'ignore_errors' => true]]);
  $r = @file_get_contents('https://api.indexnow.org/indexnow', false, $ctx);
  $GLOBALS['indexNowStatus'] = $http_response_header[0] ?? 'no response';
}
function ensureDevotionsTable(mysqli $db): void {
  // photos are kept in the database too, so a site deploy (which replaces every file) can be undone by devo_rebuild
  static $done = false; if ($done) return; $done = true;
  $db->query('CREATE TABLE IF NOT EXISTS ' . T_DEVOTIONS . ' (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(190) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    post_date DATE NOT NULL,
    reading VARCHAR(255) DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    excerpt TEXT,
    body MEDIUMTEXT,
    published TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (post_date)
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
  $c = $db->query("SHOW COLUMNS FROM " . T_DEVOTIONS . " LIKE 'image_data'");
  if ($c && $c->num_rows === 0) $db->query('ALTER TABLE ' . T_DEVOTIONS . ' ADD COLUMN image_data MEDIUMBLOB NULL');
}
function isoWeekRange(int $week, ?int $year = null): array {
  $year = $year ?: (int)date('o');
  $d = new DateTime(); $d->setISODate($year, $week, 1); $e = clone $d; $e->modify('+6 days');
  return [$d->format('F j'), $e->format('F j, Y')];
}

switch ($action) {

  // ---------- shared lookups ----------
  case 'get_books':
    $r = $db->query('SELECT id, book, booknumber FROM ' . T_BOOKS . ' ORDER BY booknumber');
    out(['success' => true, 'books' => $r->fetch_all(MYSQLI_ASSOC)]);

  case 'all_versions': {
    // every version table the API knows (read-only; used to build the PNG site's language list)
    $r = $db->query('SELECT `table`, abbreviation, language, version, publisher, copyright FROM ' . T_VERSIONS . ' ORDER BY language, version');
    $rows = []; while ($row = $r->fetch_assoc()) $rows[] = $row;
    // plus every p_* table in the database (the PNG-language Bibles are not all in bible_version_key)
    $tables = []; $t = $db->query("SHOW TABLE STATUS LIKE 'p\\_%'");
    while ($row = $t->fetch_assoc()) $tables[] = ['table' => $row['Name'], 'rows' => (int)$row['Rows'], 'comment' => $row['Comment'] ?? ''];
    out(['success' => true, 'count' => count($rows), 'versions' => $rows, 'png_tables' => $tables]);
  }
  case 'get_versions':
    $o = [];
    foreach ($ENTRY_VERSIONS as $t => $label) $o[] = ['table' => $t, 'label' => $label];
    out(['success' => true, 'versions' => $o]);

  case 'get_chapters': {
    $book = bookId($db, (string)$q('book', ''));
    $st = $db->prepare('SELECT MAX(CAST(CHAPTERNO AS UNSIGNED)) m FROM bibledb_kjv WHERE BOOKID = ?');
    $st->bind_param('s', $book); $st->execute();
    out(['success' => true, 'chapters' => (int)$st->get_result()->fetch_assoc()['m']]);
  }
  case 'get_verses': {
    $book = bookId($db, (string)$q('book', '')); $ch = (int)$q('chapter', 0);
    $st = $db->prepare('SELECT MAX(CAST(VERSENO AS UNSIGNED)) m FROM bibledb_kjv WHERE BOOKID = ? AND CHAPTERNO = ?');
    $st->bind_param('si', $book, $ch); $st->execute();
    out(['success' => true, 'verses' => (int)$st->get_result()->fetch_assoc()['m']]);
  }
  case 'preview': {
    $book = bookId($db, (string)$q('book', '')); $ch = (int)$q('chapter', 0); $v1 = (int)$q('verse', 0); $v2 = (int)$q('lastverse', 0);
    if ($ch < 1 || $v1 < 1) fail('Book, chapter and verse are required');
    $o = [];
    foreach ($ENTRY_VERSIONS as $t => $label) {
      if (!$db->query("SHOW TABLES LIKE '$t'")->num_rows) continue;
      $vs = fetchVerses($db, $t, $book, $ch, $v1, $v2);
      if ($vs) $o[] = ['table' => $t, 'label' => $label, 'verses' => $vs];
    }
    out(['success' => true, 'previews' => $o]);
  }

  // ---------- memory verse ----------
  case 'mv_get': {
    $week = (int)($q('week', '') ?: (int)date('W') + 1); if ($week > 53) $week = 1;
    $st = $db->prepare('SELECT m.id, m.book, m.chapter, m.verse, m.lastverse, m.version, b.book AS bookName FROM ' . T_MEMORY . ' m LEFT JOIN ' . T_BOOKS . ' b ON b.id = m.book WHERE m.id = ?');
    $st->bind_param('i', $week); $st->execute(); $row = $st->get_result()->fetch_assoc();
    [$from, $to] = isoWeekRange($week);
    $resp = ['success' => true, 'week' => $week, 'currentWeek' => (int)date('W'), 'range' => "$from – $to", 'exists' => (bool)$row, 'entry' => $row];
    if ($row && preg_match('/^[a-zA-Z0-9_]+$/', $row['version']) && $db->query("SHOW TABLES LIKE '{$row['version']}'")->num_rows) {
      $resp['verses'] = fetchVerses($db, $row['version'], $row['book'], (int)$row['chapter'], (int)$row['verse'], (int)$row['lastverse']);
      $resp['versionLabel'] = $ENTRY_VERSIONS[$row['version']] ?? $row['version'];
    }
    out($resp);
  }
  case 'mv_save': {
    $week = (int)$q('week', 0); if ($week < 1 || $week > 53) fail('Week must be 1–53');
    $book = bookId($db, (string)$q('book', '')); $ch = (int)$q('chapter', 0); $v1 = (int)$q('verse', 0); $v2 = (int)$q('lastverse', 0); $ver = versionTable($db, (string)$q('version', ''));
    if ($ch < 1 || $v1 < 1) fail('Chapter and verse are required'); if ($v2 && $v2 < $v1) $v2 = 0;
    $st = $db->prepare('INSERT INTO ' . T_MEMORY . ' (id, book, chapter, verse, lastverse, version) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE book=VALUES(book), chapter=VALUES(chapter), verse=VALUES(verse), lastverse=VALUES(lastverse), version=VALUES(version)');
    $st->bind_param('isiiis', $week, $book, $ch, $v1, $v2, $ver); $st->execute();
    out(['success' => true, 'message' => "Memory verse saved for week $week"]);
  }

  // ---------- gold nugget ----------
  case 'gn_status': {
    $r = $db->query('SELECT id FROM ' . T_NUGGET . ' ORDER BY id'); $d = [];
    while ($row = $r->fetch_assoc()) $d[] = (int)$row['id'];
    out(['success' => true, 'filledDays' => $d, 'count' => count($d)]);
  }
  case 'gn_get': {
    $day = (int)$q('day', 0); if ($day < 1 || $day > 366) fail('Day must be 1–366');
    $st = $db->prepare('SELECT g.*, b.book AS bookName FROM ' . T_NUGGET . ' g LEFT JOIN ' . T_BOOKS . ' b ON b.id = g.book WHERE g.id = ?');
    $st->bind_param('i', $day); $st->execute(); $row = $st->get_result()->fetch_assoc();
    out(['success' => true, 'exists' => (bool)$row, 'entry' => $row]);
  }
  case 'gn_save': {
    $day = (int)$q('day', 0); if ($day < 1 || $day > 366) fail('Day must be 1–366');
    $book = bookId($db, (string)$q('book', '')); $ch = (string)(int)$q('chapter', 0); $v1 = (string)(int)$q('verse', 0); $v2 = (string)(int)$q('lastverse', 0); $ver = versionTable($db, (string)$q('version', ''));
    if ((int)$ch < 1 || (int)$v1 < 1) fail('Chapter and verse are required');
    $st = $db->prepare('INSERT INTO ' . T_NUGGET . ' (id, book, chapter, verse, lastverse, version) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE book=VALUES(book), chapter=VALUES(chapter), verse=VALUES(verse), lastverse=VALUES(lastverse), version=VALUES(version)');
    $st->bind_param('isssss', $day, $book, $ch, $v1, $v2, $ver); $st->execute();
    out(['success' => true, 'message' => "Gold Nugget saved for day $day"]);
  }
  case 'gn_delete': {
    $day = (int)$q('day', 0); if ($day < 1 || $day > 366) fail('Day must be 1–366');
    $st = $db->prepare('DELETE FROM ' . T_NUGGET . ' WHERE id = ?'); $st->bind_param('i', $day); $st->execute();
    out(['success' => true, 'message' => "Gold Nugget removed for day $day"]);
  }

  // ---------- devotions ----------
  case 'devo_list': {
    ensureDevotionsTable($db);
    $s = '%' . (string)$q('q', '') . '%'; $lim = min(500, max(1, (int)$q('limit', 40)));
    $st = $db->prepare('SELECT id, slug, title, post_date, reading, image, published FROM ' . T_DEVOTIONS . ' WHERE title LIKE ? OR reading LIKE ? ORDER BY post_date DESC, id DESC LIMIT ?');
    $st->bind_param('ssi', $s, $s, $lim); $st->execute();
    out(['success' => true, 'devotions' => $st->get_result()->fetch_all(MYSQLI_ASSOC)]);
  }
  case 'devo_get': {
    $id = (int)$q('id', 0);
    $st = $db->prepare('SELECT * FROM ' . T_DEVOTIONS . ' WHERE id = ?'); $st->bind_param('i', $id); $st->execute();
    $row = $st->get_result()->fetch_assoc(); if (!$row) fail('Not found', 404);
    out(['success' => true, 'devotion' => $row]);
  }
  case 'devo_save': {
    ensureDevotionsTable($db);
    $id = (int)$q('id', 0); $title = trim((string)$q('title', '')); $date = (string)$q('date', ''); $reading = trim((string)$q('reading', ''));
    $body = sanitizeHtml((string)$q('body', '')); $published = (int)((string)$q('published', '1') === '1');
    if ($title === '' || $body === '') fail('Title and text are required');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) fail('Date must be YYYY-MM-DD');
    // slug: keep existing, or make one from the title (unique)
    $slug = '';
    if ($id) { $st = $db->prepare('SELECT slug, image FROM ' . T_DEVOTIONS . ' WHERE id = ?'); $st->bind_param('i', $id); $st->execute(); $old = $st->get_result()->fetch_assoc(); if (!$old) fail('Not found', 404); $slug = $old['slug']; $image = $old['image']; }
    if ($slug === '') {
      $base = slugify($title); $slug = $base; $n = 2;
      while (true) { $st = $db->prepare('SELECT id FROM ' . T_DEVOTIONS . ' WHERE slug = ?'); $st->bind_param('s', $slug); $st->execute(); if (!$st->get_result()->fetch_assoc()) break; $slug = $base . '-' . $n++; }
      $image = null;
    }
    $imageData = false;   // false = leave the stored photo alone
    // image upload (optional) — a file, or image_url for a picture that is already on the web (used when migrating)
    $tmp = '';
    if (!empty($_FILES['image']['tmp_name']) && is_uploaded_file($_FILES['image']['tmp_name'])) $tmp = $_FILES['image']['tmp_name'];
    elseif (($u = trim((string)$q('image_url', ''))) !== '' && preg_match('#^https://#', $u)) {
      $data = @file_get_contents($u, false, stream_context_create(['http' => ['timeout' => 20]]));
      if ($data === false) fail('Could not download that image');
      $tmp = tempnam(sys_get_temp_dir(), 'devo'); file_put_contents($tmp, $data);
    }
    if ($tmp !== '') {
      $info = @getimagesize($tmp); if (!$info) fail('That file is not an image');
      $src = match ($info[2]) { IMAGETYPE_JPEG => imagecreatefromjpeg($tmp), IMAGETYPE_PNG => imagecreatefrompng($tmp), IMAGETYPE_WEBP => imagecreatefromwebp($tmp), default => null };
      if (!$src) fail('Please use a JPG, PNG or WebP image');
      $w = imagesx($src); $h = imagesy($src); $nw = min(1200, $w); $nh = (int)round($h * $nw / $w);
      $dst = imagecreatetruecolor($nw, $nh); $white = imagecolorallocate($dst, 255, 255, 255); imagefill($dst, 0, 0, $white);
      imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
      $dir = SITE_ROOT . '/images/devotions'; if (!is_dir($dir)) mkdir($dir, 0755, true);
      if (function_exists('imagewebp')) { $file = "$slug.webp"; imagewebp($dst, "$dir/$file", 78); } else { $file = "$slug.jpg"; imagejpeg($dst, "$dir/$file", 82); }
      $image = "images/devotions/$file"; $imageData = file_get_contents("$dir/$file");
    }
    if ((string)$q('remove_image', '0') === '1') { $image = null; $imageData = null; }
    $excerpt = excerptOf($body);
    if ($id) {
      $st = $db->prepare('UPDATE ' . T_DEVOTIONS . ' SET title=?, post_date=?, reading=?, image=?, excerpt=?, body=?, published=? WHERE id=?');
      $st->bind_param('ssssssii', $title, $date, $reading, $image, $excerpt, $body, $published, $id); $st->execute();
    } else {
      $st = $db->prepare('INSERT INTO ' . T_DEVOTIONS . ' (slug, title, post_date, reading, image, excerpt, body, published) VALUES (?,?,?,?,?,?,?,?)');
      $st->bind_param('sssssssi', $slug, $title, $date, $reading, $image, $excerpt, $body, $published); $st->execute(); $id = $db->insert_id;
    }
    if ($imageData !== false) { $st = $db->prepare('UPDATE ' . T_DEVOTIONS . ' SET image_data = ? WHERE id = ?'); $null = null; $st->bind_param('bi', $null, $id); if ($imageData !== null) $st->send_long_data(0, $imageData); $st->execute(); }
    $n = rebuildDevotionFiles($db, $slug);
    out(['success' => true, 'id' => $id, 'slug' => $slug, 'message' => $published ? "Published. The website now shows $n devotions." : 'Saved as a draft (not shown on the website).']);
  }
  case 'devo_delete': {
    $id = (int)$q('id', 0);
    $st = $db->prepare('SELECT slug FROM ' . T_DEVOTIONS . ' WHERE id = ?'); $st->bind_param('i', $id); $st->execute(); $gone = $st->get_result()->fetch_assoc()['slug'] ?? null;
    $st = $db->prepare('DELETE FROM ' . T_DEVOTIONS . ' WHERE id = ?'); $st->bind_param('i', $id); $st->execute();
    $n = rebuildDevotionFiles($db, $gone);
    out(['success' => true, 'message' => "Deleted. The website now shows $n devotions."]);
  }
  case 'devo_rebuild': {
    ensureDevotionsTable($db);
    $n = rebuildDevotionFiles($db);
    out(['success' => true, 'message' => "$n devotion files written, " . ($GLOBALS['restoredImages'] ?? 0) . ' photos restored from the database', 'indexnow' => $GLOBALS['indexNowStatus'] ?? 'not sent']);
  }
  case 'devo_import': {
    // One-time import of the WordPress devotions from import/devotions_import.json
    ensureDevotionsTable($db);
    $file = __DIR__ . '/import/devotions_import.json';
    if (!is_file($file)) fail('import/devotions_import.json is missing');
    $posts = json_decode(file_get_contents($file), true); $n = 0;
    $st = $db->prepare('INSERT INTO ' . T_DEVOTIONS . ' (slug, title, post_date, reading, image, excerpt, body, published) VALUES (?,?,?,?,?,?,?,1) ON DUPLICATE KEY UPDATE title=VALUES(title), post_date=VALUES(post_date), reading=VALUES(reading), image=VALUES(image), excerpt=VALUES(excerpt), body=VALUES(body)');
    foreach ($posts as $p) {
      $st->bind_param('sssssss', $p['slug'], $p['title'], $p['date'], $p['reading'], $p['image'], $p['excerpt'], $p['body']); $st->execute(); $n++;
    }
    $w = rebuildDevotionFiles($db);
    out(['success' => true, 'message' => "Imported $n devotions; $w files written. You can delete the import folder now."]);
  }

  // ---------- content for the social-media posting jobs (public data only, never future weeks) ----------
  case 'social_content': {
    ensureDevotionsTable($db);
    $tz = new DateTimeZone('Asia/Manila');   // same clock as the website's Monday switch-over
    $today = new DateTime('now', $tz); $today->setTime(12, 0);
    $date = (string)$q('date', '');
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {                 // optional, for testing: a past day
      $d = DateTime::createFromFormat('Y-m-d H:i', "$date 12:00", $tz);
      if ($d && $d <= $today) $today = $d;
    }
    // this week = Monday..Sunday containing that day
    $mon = clone $today; $mon->modify('monday this week');   // PHP counts Sunday as the last day of the week, as the website does
    $sun = clone $mon; $sun->modify('+6 days');
    $range = $mon->format('M j') . ' – ' . ($mon->format('M') === $sun->format('M') ? $sun->format('j') : $sun->format('M j')) . ', ' . $sun->format('Y');
    $week = (int)$today->format('W'); if ($week > 53) $week = 1;
    $out = ['success' => true, 'date' => $today->format('Y-m-d'), 'week' => $week, 'weekStart' => $mon->format('Y-m-d'), 'weekEnd' => $sun->format('Y-m-d'), 'weekRange' => $range, 'site' => 'https://ephod4png.com'];

    $refOf = function (array $r): string {
      $ref = $r['bookName'] . ' ' . (int)$r['chapter'] . ':' . (int)$r['verse'];
      return ((int)$r['lastverse'] > (int)$r['verse']) ? $ref . '-' . (int)$r['lastverse'] : $ref;
    };
    $textOf = function (string $table, array $r) use ($db): string {
      if (!preg_match('/^[a-zA-Z0-9_]+$/', $table) || !$db->query("SHOW TABLES LIKE '$table'")->num_rows) return '';
      $vs = fetchVerses($db, $table, $r['book'], (int)$r['chapter'], (int)$r['verse'], (int)$r['lastverse']);
      return trim(implode(' ', array_map(fn($v) => trim(strip_tags($v['text'])), $vs)));
    };

    // memory verse: the English version Zarah chose + Tok Pisin
    $st = $db->prepare('SELECT m.book, m.chapter, m.verse, m.lastverse, m.version, b.book AS bookName FROM ' . T_MEMORY . ' m LEFT JOIN ' . T_BOOKS . ' b ON b.id = m.book WHERE m.id = ?');
    $st->bind_param('i', $week); $st->execute(); $mv = $st->get_result()->fetch_assoc();
    $out['memoryVerse'] = $mv ? [
      'reference' => $refOf($mv), 'englishVersion' => $mv['version'], 'englishVersionLabel' => $ENTRY_VERSIONS[$mv['version']] ?? $mv['version'],
      'english' => $textOf($mv['version'], $mv), 'tokPisin' => $textOf('p_tok', $mv),
    ] : null;

    // this week's devotion: the one whose week (the Monday after its date) starts on $mon
    $dev = null;
    $r = $db->query('SELECT slug, title, post_date, reading, image, excerpt FROM ' . T_DEVOTIONS . ' WHERE published = 1 ORDER BY post_date DESC LIMIT 12');
    while ($row = $r->fetch_assoc()) {
      $d = new DateTime($row['post_date'] . ' 12:00', $tz); $dow = (int)$d->format('w');   // 0 = Sunday, as in the website
      $d->modify('+' . (((8 - $dow) % 7) ?: 7) . ' days');
      if ($d->format('Y-m-d') === $mon->format('Y-m-d')) { $dev = $row; break; }
    }
    $out['devotion'] = $dev ? [
      'title' => $dev['title'], 'reading' => $dev['reading'], 'excerpt' => $dev['excerpt'],
      'url' => 'https://ephod4png.com/devotion.html?slug=' . $dev['slug'],
      'image' => $dev['image'] ? 'https://ephod4png.com/' . $dev['image'] : null,
    ] : null;

    // today's Gold Nugget: day of the year on a non-leap calendar, Feb 29 = day 366 (as the website does it)
    $m = (int)$today->format('n'); $dm = (int)$today->format('j');
    $mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    $day = ($m === 2 && $dm === 29) ? 366 : array_sum(array_slice($mdays, 0, $m - 1)) + $dm;
    $st = $db->prepare('SELECT g.book, g.chapter, g.verse, g.lastverse, g.version, b.book AS bookName FROM ' . T_NUGGET . ' g LEFT JOIN ' . T_BOOKS . ' b ON b.id = g.book WHERE g.id = ?');
    $st->bind_param('i', $day); $st->execute(); $gn = $st->get_result()->fetch_assoc();
    $out['goldNugget'] = $gn ? [
      'day' => $day, 'reference' => $refOf($gn), 'englishVersion' => $gn['version'], 'englishVersionLabel' => $ENTRY_VERSIONS[$gn['version']] ?? $gn['version'],
      'text' => $textOf($gn['version'], $gn), 'tokPisin' => $textOf('p_tok', $gn),
    ] : null;
    out($out);
  }

  default:
    fail('Unknown action');
}
