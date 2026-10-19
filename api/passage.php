<?php
// ============================================================
// Read-only: returns the verses of a passage in one Bible version.
// GET passage.php?book=Isaiah&c1=36&v1=1&c2=38&v2=22&version=bibledb_kjv
// Used by the devotion page to show the week's reading beside the devotion.
// ============================================================
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=86400');
header('X-Content-Type-Options: nosniff');
require __DIR__ . '/config.php';
$cfg = dirname(__DIR__) . '/' . ENTRY_DIR . '/config.php';
if (!is_file($cfg)) { http_response_code(500); echo json_encode(['success' => false, 'error' => 'Entry folder not found; check api/config.php']); exit; }
require $cfg;

function out(array $a, int $code = 200): void { http_response_code($code); echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function norm(string $s): string {
  $s = strtolower(trim($s));
  $s = preg_replace('/^(1st|first|i)\s+/', '1 ', $s);
  $s = preg_replace('/^(2nd|second|ii)\s+/', '2 ', $s);
  $s = preg_replace('/^(3rd|third|iii)\s+/', '3 ', $s);
  $s = preg_replace('/^psalm$/', 'psalms', $s);
  $s = preg_replace('/^song of songs$/', 'song of solomon', $s);
  return preg_replace('/\s+/', ' ', $s);
}

$book = (string)($_GET['book'] ?? ''); $c1 = (int)($_GET['c1'] ?? 0); $v1 = (int)($_GET['v1'] ?? 1);
$c2 = (int)($_GET['c2'] ?? $c1); $v2 = (int)($_GET['v2'] ?? 0); $version = (string)($_GET['version'] ?? 'bibledb_kjv');
if ($book === '' || $c1 < 1) out(['success' => false, 'error' => 'book and c1 are required'], 400);
if (!preg_match('/^[a-zA-Z0-9_]+$/', $version)) out(['success' => false, 'error' => 'bad version'], 400);
if ($c2 < $c1) $c2 = $c1;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); $db->set_charset('utf8mb4');
  if (!$db->query("SHOW TABLES LIKE '$version'")->num_rows) out(['success' => false, 'error' => 'unknown version'], 404);
  // find the book id by name (handles "1 Timothy" vs "1st Timothy")
  $id = null; $name = null; $want = norm($book);
  $r = $db->query('SELECT id, book FROM ' . T_BOOKS);
  while ($row = $r->fetch_assoc()) { if (norm($row['book']) === $want) { $id = $row['id']; $name = $row['book']; break; } }
  if ($id === null) out(['success' => false, 'error' => 'unknown book: ' . $book], 404);
  $vLast = $v2 > 0 ? $v2 : 999;
  $sql = "SELECT CHAPTERNO, VERSENO, VERSETEXT FROM `$version` WHERE BOOKID = ? AND (
            (CAST(CHAPTERNO AS UNSIGNED) = ? AND CAST(CHAPTERNO AS UNSIGNED) = ? AND CAST(VERSENO AS UNSIGNED) BETWEEN ? AND ?)
         OR (CAST(CHAPTERNO AS UNSIGNED) = ? AND CAST(CHAPTERNO AS UNSIGNED) < ? AND CAST(VERSENO AS UNSIGNED) >= ?)
         OR (CAST(CHAPTERNO AS UNSIGNED) > ? AND CAST(CHAPTERNO AS UNSIGNED) < ?)
         OR (CAST(CHAPTERNO AS UNSIGNED) = ? AND CAST(CHAPTERNO AS UNSIGNED) > ? AND CAST(VERSENO AS UNSIGNED) <= ?)
          ) ORDER BY CAST(CHAPTERNO AS UNSIGNED), CAST(VERSENO AS UNSIGNED)";
  $st = $db->prepare($sql);
  $st->bind_param('siiiiiiiiiiii', $id, $c1, $c2, $v1, $vLast, $c1, $c2, $v1, $c1, $c2, $c2, $c1, $vLast);
  $st->execute(); $res = $st->get_result();
  $chapters = []; $n = 0;
  while ($row = $res->fetch_assoc()) {
    $ch = (int)$row['CHAPTERNO'];
    if (!isset($chapters[$ch])) $chapters[$ch] = ['number' => $ch, 'verses' => []];
    $chapters[$ch]['verses'][] = ['number' => (int)$row['VERSENO'], 'text' => $row['VERSETEXT']]; $n++;
  }
  $vi = null;
  $st = $db->prepare('SELECT abbreviation, language, version, info_url, publisher, copyright FROM ' . T_VERSIONS . ' WHERE `table` = ?');
  $st->bind_param('s', $version); $st->execute(); $vi = $st->get_result()->fetch_assoc();
  out(['success' => true, 'book' => $name, 'bookId' => $id, 'version' => $version, 'versionInfo' => $vi, 'verseCount' => $n, 'chapters' => array_values($chapters)]);
} catch (Throwable $e) {
  out(['success' => false, 'error' => 'Database error'], 500);
}
