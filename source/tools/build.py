#!/usr/bin/env python3
"""Build the EPHOD static site: src/ -> dist/."""
import json, os, re, shutil, sys, datetime
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE=(sys.argv[sys.argv.index('--site')+1] if '--site' in sys.argv else 'ph')
SRC0=os.path.join(ROOT,'src'); DIST=os.path.join(ROOT,'dist' if SITE=='ph' else 'dist-'+SITE)
# a site overlay (src/sites/<site>/…) replaces same-named files; build from a merged copy
SRC=SRC0
if SITE!='ph':
    import tempfile
    SRC=os.path.join(tempfile.gettempdir(),'ephod-src-'+SITE)
    if os.path.exists(SRC): shutil.rmtree(SRC)
    shutil.copytree(SRC0,SRC,ignore=shutil.ignore_patterns('sites'))
    ov=os.path.join(SRC0,'sites',SITE)
    for dp,dn,fn in os.walk(ov):
        for f in fn:
            rel=os.path.relpath(os.path.join(dp,f),ov); os.makedirs(os.path.dirname(os.path.join(SRC,rel)),exist_ok=True); shutil.copy(os.path.join(dp,f),os.path.join(SRC,rel))
SITE_URLS={'ph':'https://ephodlifestyle.com','png':'https://ephod4png.com'}
SITE_URL=SITE_URLS[SITE]
SITE_NAME={'ph':'EPHOD','png':'EPHOD PNG'}[SITE]
OG_IMAGE=SITE_URL+'/images/og-ephod.jpg'
# Both sites carry the same pages for two regions: tell search engines so instead of letting them
# treat one site as a copy of the other (hreflang pair, x-default = the Philippines/worldwide site).
HREFLANG={'ph':'en-PH','png':'en-PG'}
def alternates(path):
    out=''
    for s,u in SITE_URLS.items(): out+='  <link rel="alternate" hreflang="%s" href="%s/%s">\n'%(HREFLANG[s],u,path)
    return out+'  <link rel="alternate" hreflang="x-default" href="%s/%s">\n'%(SITE_URLS['ph'],path)
def jsonld(obj): return '  <script type="application/ld+json">'+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'</script>\n'
layout=open(os.path.join(SRC,'layout.html'),encoding='utf-8').read()
if SITE=='png':
    layout=layout.replace('<a href="apps.html">EPHOD PH app</a>','<a href="apps.html">EPHOD PNG app</a>')
if os.path.exists(DIST): shutil.rmtree(DIST)
os.makedirs(DIST)
for d in ('css','js','images','handouts'):
    shutil.copytree(os.path.join(SRC,d),os.path.join(DIST,d))
shutil.copy(os.path.join(SRC,'favicon.svg'),DIST)
# Entry pages live at the hidden URLs Zarah and Herb & Karen already use:
#   /memoryverse/memoryverse196804.php  (Zarah: memory verse)  + /memoryverse/devotions196804.php
#   /goldnugget/golden_nugget_admin.html (Herb & Karen)
ENTRY={'memoryverse':{'memory-verse.html':'memoryverse196804.php','devotions.html':'devotions196804.php'},
       'goldnugget':{'gold-nugget.html':'golden_nugget_admin.html'}}
RENAMES={k:v for d in ENTRY.values() for k,v in d.items()}
adm=os.path.join(SRC,'admin')
for folder,pages in ENTRY.items():
    out=os.path.join(DIST,folder); os.makedirs(out)
    for f in os.listdir(adm):
        src=os.path.join(adm,f)
        if f.endswith('.html'):
            if f in pages:
                h=open(src,encoding='utf-8').read()
                for a,b in RENAMES.items(): h=h.replace('href="%s"'%a,'href="%s"'%b)
                open(os.path.join(out,pages[f]),'w',encoding='utf-8').write(h)
        elif f=='import':
            if folder=='memoryverse': shutil.copytree(src,os.path.join(out,'import'))
        elif os.path.isfile(src): shutil.copy(src,out)
shutil.copy(os.path.join(SRC,'htaccess.txt'),os.path.join(DIST,'.htaccess'))
year=str(datetime.date.today().year)
import hashlib
def stamp(rel):
    h=hashlib.md5(open(os.path.join(SRC,rel),'rb').read()).hexdigest()[:8]
    return rel+'?v='+h
layout=layout.replace('href="css/themes.css"','href="%s"'%stamp('css/themes.css')).replace('href="css/site.css"','href="%s"'%stamp('css/site.css')).replace('src="js/config.js"','src="%s"'%stamp('js/config.js')).replace('src="js/ephod.js"','src="%s"'%stamp('js/ephod.js'))
# ---- structured data (JSON-LD) ----
cfg=open(os.path.join(SRC,'js/config.js'),encoding='utf-8').read()
def store(app,key):
    m=re.search(r'\b%s:\s*\{([^}]*)\}'%app,cfg); m2=m and re.search(r'\b%s:\s*"([^"]*)"'%key,m.group(1)); return m2.group(1) if m2 else ''
ORG={"@type":"Organization","@id":SITE_URLS['ph']+"/#org","name":"EPHOD Discipleship","alternateName":"EPHOD — Every Person Household Oikos Discipled",
     "url":SITE_URLS['ph']+"/","logo":SITE_URLS['ph']+"/images/ephod-banner-1200.webp",
     "founder":[{"@type":"Person","name":"Herb Johnson"},{"@type":"Person","name":"Karen Johnson"}],
     "sameAs":["https://www.facebook.com/ephodlifestyle/","https://www.youtube.com/channel/UCJKO4sIhohnlkeiCB7mFcbQ","https://vimeo.com/user193302610",SITE_URLS['png']+"/"],
     "email":"kevin@ephodlifestyle.com"}
APP={'ph':("EPHOD PH","English, Tagalog and Chinese interface; KJV, WEB, ASV, BBE, Tagalog (Ang Dating Biblia) and Chinese Bibles."),
     'png':("EPHOD PNG","English and Tok Pisin interface; the Tok Pisin Bible and more than 200 Papua New Guinea language translations.")}[SITE]
LD={
 'index.html':[ORG,{"@type":"WebSite","name":SITE_NAME,"url":SITE_URL+"/","publisher":{"@id":SITE_URLS['ph']+"/#org"},"inLanguage":"en"}],
 'apps.html':[{"@type":"SoftwareApplication","name":APP[0],"operatingSystem":"Android, iOS","applicationCategory":"LifestyleApplication",
   "description":"Free offline Bible reading app for the EPHOD plan: daily morning and evening readings, weekly memory verse, daily Gold Nugget, journal and progress tracker. No ads, nothing to buy. "+APP[1],
   "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"isAccessibleForFree":True,"author":{"@id":SITE_URLS['ph']+"/#org"},
   "installUrl":[u for u in (store(SITE,'play'),store(SITE,'apple')) if u],"image":OG_IMAGE,"url":SITE_URL+"/apps.html"}],
 'seminars.html':[{"@type":"Course","name":"EPHOD Church Strengthening Seminars","description":"A free online discipleship course: thirteen video seminars by Rev. Herb and Rev. Karen Johnson on being a disciple and a disciple maker of Jesus Christ, with printable handouts, a quiz for each seminar and a certificate.",
   "provider":{"@id":SITE_URLS['ph']+"/#org"},"isAccessibleForFree":True,"inLanguage":"en","url":SITE_URL+"/seminars.html","image":OG_IMAGE,
   "offers":{"@type":"Offer","price":"0","priceCurrency":"USD","category":"Free"},
   "hasCourseInstance":{"@type":"CourseInstance","courseMode":"Online","courseWorkload":"PT8H","courseSchedule":{"@type":"Schedule","repeatFrequency":"Weekly","repeatCount":13}}}],
}
def render(meta,body,path,extra_ld=None):
    """Fill the layout for one page. path = URL path from the site root ('' for the home page)."""
    html=layout
    import html as _h
    for k in ('title','description','page'): html=html.replace('{{%s}}'%k,_h.escape(meta.get(k,''),quote=(k=='description')) if k!='page' else meta.get(k,''))
    ld=''.join(jsonld(dict({"@context":"https://schema.org"},**o)) for o in (extra_ld or []))
    html=(html.replace('{{body_attrs}}',meta.get('body_attrs','')).replace('{{year}}',year)
          .replace('{{canonical}}',SITE_URL+'/'+path).replace('{{alternates}}',alternates(path))
          .replace('{{site_name}}',SITE_NAME).replace('{{og_type}}',meta.get('og_type','website'))
          .replace('{{og_image}}',meta.get('og_image',OG_IMAGE)).replace('{{jsonld}}',ld).replace('{{content}}',body))
    for js in ('js/seminars.js','js/course.js'):
        html=html.replace('src="%s"'%js,'src="%s"'%stamp(js))
    return html
# per-site title/description overrides (src/sites/<site>/meta.json), so the PNG site is not a word-for-word copy
OVER={}
if os.path.exists(os.path.join(SRC,'meta.json')): OVER=json.load(open(os.path.join(SRC,'meta.json'),encoding='utf-8'))
for f in sorted(os.listdir(os.path.join(SRC,'pages'))):
    if not f.endswith('.html'): continue
    s=open(os.path.join(SRC,'pages',f),encoding='utf-8').read()
    m=re.match(r'\s*<!--\s*(\{.*?\})\s*-->\s*',s,flags=re.S)
    meta=json.loads(m.group(1)); body=s[m.end():]
    # A verse can be swapped without editing the page: <!--verse:name|Reference-->default<!--/verse--> in a page is replaced by
    # src/verses/<name>.txt when that file exists (line 1 = the verse text, line 2 = the version label, e.g. ESV).
    # Meant for text that must be typed by a person, not by the build or an assistant.
    def _verse(mm):
        name,ref,default=mm.group(1),mm.group(2),mm.group(3)
        fp=os.path.join(SRC,'verses',name+'.txt')
        if not os.path.exists(fp): return default
        ln=[x.strip() for x in open(fp,encoding='utf-8').read().splitlines() if x.strip()]
        if len(ln)<2: return default
        import html as _h
        return '\u201c%s\u201d <cite>%s %s</cite>'%(_h.escape(ln[0].strip('\u201c\u201d"')),ref,_h.escape(ln[1]))
    body=re.sub(r'<!--verse:([a-z0-9-]+)\|([^>]*?)-->(.*?)<!--/verse-->',_verse,body,flags=re.S)
    meta.update(OVER.get(f,{}))
    if SITE!='ph' and re.search(r'\| EPHOD( Seminars)?$',meta['title']): meta['title']=re.sub(r'\| EPHOD( Seminars)?$','| '+SITE_NAME,meta['title'])
    open(os.path.join(DIST,f),'w',encoding='utf-8').write(render(meta,body,'' if f=='index.html' else f,LD.get(f)))

# ---- template for the static devotion pages ----
# The live server writes one real HTML page per published devotion at /devotion/<slug>.html
# (api.php, rebuildDevotionFiles) so every devotion is a page search engines can read, with its own
# title, description, share image and Article data. This template is the layout with %%FIELDS%% for
# api.php to fill; the pages live one folder down, so relative links get a ../ prefix.
tpl_meta={'title':'%%TITLE%%','description':'%%DESCRIPTION%%','page':'devotion-static','og_type':'article','og_image':'%%IMAGE%%'}
tpl_body='''<section class="section">
  <div class="wrap">
    <p class="meta"><a href="devotions.html">← All devotions</a></p>
    <div class="devo-layout">
      <article class="article" id="devotion" data-date="%%DATE%%" data-reading="%%READING%%">%%ARTICLE%%</article>
      <aside class="passage-panel" id="passage-panel" hidden>
        <div class="passage-head">
          <h2 id="passage-title">This week's reading</h2>
          <div class="field"><label for="version-devo" class="small">Bible version</label><select id="version-devo" class="version-select"></select></div>
        </div>
        <div class="scripture passage-body" id="passage"></div>
        <p class="copyright-note" id="passage-copyright"></p>
      </aside>
    </div>
  </div>
</section>
'''
tpl=render(tpl_meta,tpl_body,'devotion/%%SLUG%%.html')
tpl=tpl.replace('</head>','%%JSONLD%%</head>').replace('  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n','')
tpl=re.sub(r'(href|src)="(?!https?:|//|/|#|mailto:|\.\./|%%)',r'\1="../',tpl)
open(os.path.join(DIST,'memoryverse','devotion-template.html'),'w',encoding='utf-8').write(tpl)
# IndexNow (Bing, DuckDuckGo, Yahoo, Yandex): the key file proves we own the site; api.php submits
# every new or changed devotion page the moment it is saved.
INDEXNOW_KEY='eca2896dae446c2dec26bff68af7c23a'
open(os.path.join(DIST,INDEXNOW_KEY+'.txt'),'w').write(INDEXNOW_KEY)
open(os.path.join(DIST,'memoryverse','site.json'),'w',encoding='utf-8').write(json.dumps({'site':SITE,'url':SITE_URL,'name':SITE_NAME,'peer':[u for s,u in SITE_URLS.items() if s!=SITE],'indexnow_key':INDEXNOW_KEY}))
# devotions data
posts=json.load(open(os.path.join(ROOT,'tools','devotions_full.json'),encoding='utf-8'))
posts.sort(key=lambda p:p['date'],reverse=True)
# data/devotions/ is NOT built or deployed: the live site generates it from the database
# (api.php?action=devo_rebuild, and automatically whenever a devotion is saved), so a deploy
# never overwrites it. devotions_full.json is kept only for the sitemap and the one-time import.
# version-stamp the entry pages' assets too (they are cached for an hour)
for folder in ENTRY:
  ad=os.path.join(DIST,folder)
  for f in os.listdir(ad):
    if not (f.endswith('.html') or f.endswith('.php')) or f in ('api.php','config.php'): continue
    fp=os.path.join(ad,f); s=open(fp,encoding='utf-8').read()
    s=s.replace('href="../css/themes.css"','href="../%s"'%stamp('css/themes.css')).replace('href="../css/site.css"','href="../%s"'%stamp('css/site.css'))
    s=s.replace('href="admin.css"','href="%s"'%stamp('admin/admin.css').replace('admin/','')).replace('src="admin.js"','src="%s"'%stamp('admin/admin.js').replace('admin/',''))
    open(fp,'w',encoding='utf-8').write(s)
# robots.txt and sitemaps for the live domain.
# sitemap.xml is an index: sitemap-pages.xml (built here) + sitemap-devotions.xml (written on the
# server by api.php with the devotion pages, so it is current whenever Zarah publishes one).
open(os.path.join(DIST,'robots.txt'),'w').write("User-agent: *\nDisallow: /memoryverse/\nDisallow: /goldnugget/\nDisallow: /source/\nAllow: /\nSitemap: %s/sitemap.xml\n"%SITE_URL)
pages=[f for f in sorted(os.listdir(DIST)) if f.endswith('.html') and f not in ('404.html','devotion.html','certificate.html','seminar.html')]
urls=[SITE_URL+'/']+[SITE_URL+'/'+f for f in pages if f!='index.html']+[SITE_URL+'/seminar.html?n=%d'%n for n in range(1,14)]
today=datetime.date.today().isoformat()
open(os.path.join(DIST,'sitemap-pages.xml'),'w',encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>%s</loc><lastmod>%s</lastmod></url>\n'%(u,today) for u in urls)+'</urlset>\n')
open(os.path.join(DIST,'sitemap.xml'),'w',encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>%s/sitemap-pages.xml</loc></sitemap>\n<sitemap><loc>%s/sitemap-devotions.xml</loc></sitemap>\n</sitemapindex>\n'%(SITE_URL,SITE_URL))
shutil.copy(os.path.join(SRC,'README-DEPLOY.md'),os.path.join(DIST,'README-DEPLOY.md'))
print("built",len(posts),"devotions;",len([f for f in os.listdir(DIST) if f.endswith('.html')]),"pages")
