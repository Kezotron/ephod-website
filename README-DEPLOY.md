# ephodlifestyle.com — the new site

Plain HTML, CSS and JavaScript. No WordPress, no plugins, no logins. Scripture comes
from the same API the apps use (`https://www.uneashippinglimited.com/api/`). The only
PHP on the site is the small folder of entry pages for Zarah, Herb and Karen.

## What's in the zip

```
index.html, am-reading.html, pm-reading.html, catch-up.html, reading-plan.html,
memory-verse.html, gold-nugget.html, devotions.html, devotion.html, apps.html,
seminars.html, about.html, contact.html, privacy-policy.html
css/        themes.css (colours — the themes live here), site.css (layout)
js/         config.js (settings: API, default theme, store links), ephod.js
images/     photos; images/devotions/ one photo per devotion
data/devotions/   index.json, all.json and one JSON file per devotion (written by the entry page)
memoryverse/         Zarah's pages: memoryverse196804.php, devotions196804.php (+ api.php, config.php, one-time import)
goldnugget/          Herb & Karen's page: golden_nugget_admin.html (+ api.php, config.php)
.htaccess   redirects from the old WordPress addresses; keeps /checkmate/-style links working
```

## Try it first, without touching the live site (10 minutes)

1. In hPanel → File Manager, open `public_html` and create a folder called `new`.
2. Upload `ephod-site.zip` into `new` and use the File Manager's **Extract** on it, so that
   `public_html/new/index.html` exists. Delete the zip afterwards.
3. Open `https://ephodlifestyle.com/new/`. Everything except the devotions works at once
   (readings, memory verse, Gold Nugget, themes). To see the devotions on the staging copy,
   do steps 2, 3 and 6 below inside `new/` as well.
4. Show it around. Nothing on the WordPress site has changed. When you're happy, follow
   the steps below to go live, and delete the `new` folder.

## Going live on Hostinger (about 30 minutes)

1. **Back up first.** hPanel → Websites → Manage → Backups → generate a full backup
   (files and database). Download it. If anything goes wrong you can restore WordPress.

2. **Entry pages.** They are already at the hidden addresses in use: `/memoryverse/memoryverse196804.php` (Zarah — memory verse), `/memoryverse/devotions196804.php` (Zarah — devotions) and `/goldnugget/golden_nugget_admin.html` (Herb & Karen). Nothing to rename.
3. **Put the database password in** `…/config.php` (the folder you just renamed).
   It is the same database the API uses. If you rotate the password later (you should),
   change it here and in the API's `config/database.php`.

4. **Clear public_html.** In hPanel File Manager, open `public_html`. Delete everything
   in it (WordPress files, wp-content, wp-admin, wp-includes, .htaccess — all of it).
   You already have the backup and the uploads folder on your PC.

5. **Upload the site.** Upload the unzipped files into `public_html` so that
   `index.html` is directly inside `public_html`. Make sure `.htaccess` came along
   (File Manager hides dot-files by default; turn on "show hidden files").

6. **Import the devotions.** In a browser open
   `https://ephodlifestyle.com/YOUR-SECRET-FOLDER/api.php?action=devo_import`
   once. It creates the `devotions` table, loads all 442 devotions, and writes the
   JSON files the website reads. You should see "Imported 442 devotions".
   Then delete the `import` folder inside your secret folder.

7. **Check the site.** Open ephodlifestyle.com. Today's readings, the memory verse and the
   Gold Nugget should load. Open a devotion. Try an old link such as
   `https://ephodlifestyle.com/checkmate/` — it should open the devotion.

8. **Tell the team their new pages:**
   - Zarah: `https://ephodlifestyle.com/YOUR-SECRET-FOLDER/memory-verse.html` and
     `…/devotions.html`
   - Herb and Karen: `…/gold-nugget.html`

9. **Drop the WordPress database tables** (optional, later). The site database is the
   same one the API uses, so don't delete the database — only the `wp_*` tables, from
   phpMyAdmin, once you're sure you won't need them.

## Changing the look

Everything about colour is in `css/themes.css`. Five themes are included: morning
(default), evening (dark), heritage (the purple and blue of the original banner), harbor,
vineyard. Visitors can switch in the footer; to change the default, edit
`DEFAULT_THEME` in `js/config.js`. To preview a theme on any page add `?theme=harbor`
to the address. To add a theme, copy a block in themes.css and give it a new name.
To hide the footer picker, set `SHOW_THEME_PICKER: false`.

## Settings you will want to change in js/config.js

- `STORES` — paste the two App Store links when you have them (the buttons are greyed
  until then). The Play Store links are already in.
- `VERSIONS` — which Bible versions the website offers. Only public-domain and
  Creative-Commons versions are listed. Add a line when a licence is granted.
- `COPYRIGHT` — the copyright line shown under Scripture for each version.

## Two things to fix on the API side (not urgent)

- `am_bible_reading.php` and `pm_bible_reading.php` return an empty `versionInfo`;
  the Gold Nugget endpoint fills it correctly. The website works around this with the
  `COPYRIGHT` table in config.js, but the apps would benefit from the fix.
- The API still sends `Access-Control-Allow-Origin: *`. The website needs
  `https://ephodlifestyle.com` allowed; the apps don't send an Origin at all.

## Rebuilding from source

The `src/` folder plus `tools/build.py` regenerate everything in `dist/`
(`python3 tools/build.py`). You only need this if you change the pages themselves;
devotions, memory verses and Gold Nuggets are all changed through the entry pages.

## Database password (important)
Hostinger's GitHub deploy replaces everything in `public_html`, so a `config.local.php` inside it gets deleted on the next push. Keep the password file **outside** `public_html` instead:

`domains/<your-site>/ephod-config.local.php` (the folder that contains `public_html`), containing one line:

```php
<?php define('DB_PASS', 'the-password');
```

`memoryverse/config.php` and `goldnugget/config.php` look there first. Check with `/memoryverse/api.php?action=db_check` — it says whether it connected and which tables it can see.
