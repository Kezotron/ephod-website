# ephodlifestyle.com

The EPHOD website: plain HTML, CSS and JavaScript, with Scripture served by the EPHOD API
and three small PHP entry pages for the team. See **README-DEPLOY.md** for hosting steps.

- Site files are at the root of this repository (Hostinger deploys the repository as-is).
- `source/` holds the page templates and the build script; the root is rebuilt from it with
  `python3 source/tools/build.py` (output lands in `source/../dist`, copy it to the root).
- `admin-ephod-entry/` are the entry pages. Rename this folder on the server only, never in Git;
  the database password lives in `config.local.php`, which Git ignores.
