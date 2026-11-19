/* ============================================================
   EPHOD site configuration — the only file most edits need.
   ============================================================ */
window.EPHOD_CONFIG = {
  // Where the Bible API lives (same endpoints the apps use)
  API_BASE: "https://www.uneashippinglimited.com/api/",

  // Look of the site. Options: classic, evening, morning, harbor, vineyard
  // (defined in css/themes.css). Visitors can switch in the footer; this is the default.
  DEFAULT_THEME: "classic",
  SHOW_THEME_PICKER: true,

  // Bible version shown when a visitor hasn't chosen one
  DEFAULT_VERSION: "bibledb_kjv",

  // Versions offered on the website (table name -> label). Only versions EPHOD is
  // cleared to publish in full (public domain, Creative Commons, or permission).
  VERSIONS: [
    { table: "bibledb_kjv",        label: "King James Version",            abbr: "KJV", lang: "English" },
    { table: "t_asv",              label: "American Standard Version",     abbr: "ASV", lang: "English" },
    { table: "t_web",              label: "World English Bible",           abbr: "WEB", lang: "English" },
    { table: "t_bbe",              label: "Bible in Basic English",        abbr: "BBE", lang: "English" },
    { table: "t_dby",              label: "Darby Translation",             abbr: "DBY", lang: "English" },
    { table: "bible_verses_tagab", label: "Ang Dating Biblia (Tagalog)",   abbr: "ADB", lang: "Tagalog" },
    { table: "p_tok",              label: "Buk Baibel long Tok Pisin",     abbr: "TPI", lang: "Tok Pisin" },
    { table: "t_frLSG",            label: "Louis Segond 1910 (Français)",  abbr: "LSG", lang: "French" },
    { table: "t_ncvs",             label: "新译本 (简体中文)",              abbr: "CNVS", lang: "Chinese" },
    { table: "t_ncvt",             label: "新譯本 (繁體中文)",              abbr: "CNVT", lang: "Chinese" }
  ],

  // Copyright lines, used when the API doesn't return versionInfo
  COPYRIGHT: {
    bibledb_kjv: "King James Version. Public domain.",
    t_asv: "American Standard Version (1901). Public domain.",
    t_web: "World English Bible. Public domain.",
    t_bbe: "Bible in Basic English. Public domain.",
    t_dby: "Darby Translation. Public domain.",
    t_frLSG: "Louis Segond 1910. Domaine public.",
    bible_verses_tagab: "Ang Dating Biblia (1905). Public domain.",
    p_tok: "Buk Baibel long Tok Pisin. Copyright © 1969–2008 The Bible Society of Papua New Guinea. Released under CC BY-NC-ND 4.0 via png.bible.",
    t_ncvs: "Chinese New Version (新译本). Copyright © 1976, 1992, 1999, 2001, 2005, 2010 The Worldwide Bible Society Limited. Text via eBible.org.",
    t_ncvt: "Chinese New Version (新譯本). Copyright © 1976, 1992, 1999, 2001, 2005, 2010 The Worldwide Bible Society Limited. Text via eBible.org.",
    t_niv: "Scripture taken from the Holy Bible, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide."
  },

  // The Papua New Guinea app (EPHOD PNG) has its own website
  PNG_SITE: "https://ephod4png.com",

  // App store links
  STORES: {
    // ph.link is the OneLink address the printed QR code points to (sends phones to the right store)
    ph:  { play: "https://play.google.com/store/apps/details?id=com.ephodlifestyle.ephod",     apple: "https://apps.apple.com/ph/app/ephod-ph/id6758357838", link: "https://onelink.to/e5rg4h" },
    png: { play: "https://play.google.com/store/apps/details?id=com.ephod4png.ephod", apple: "" }
  },

  // Where the devotions live (written by the devotions entry page)
  DEVOTIONS_INDEX: "data/devotions/index.json",
  DEVOTIONS_DIR: "data/devotions/",

  CONTACT_EMAIL: "kevin@ephodlifestyle.com",
  FACEBOOK: "https://www.facebook.com/ephodlifestyle/",
  YOUTUBE: "https://www.youtube.com/channel/UCJKO4sIhohnlkeiCB7mFcbQ"
};
