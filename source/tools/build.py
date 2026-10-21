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
SITE_URL={'ph':'https://ephodlifestyle.com','png':'https://ephod4png.com'}[SITE]
SITE_NAME={'ph':'EPHOD','png':'EPHOD PNG'}[SITE]
layout=open(os.path.join(SRC,'layout.html'),encoding='utf-8').read()
if SITE=='png':
    layout=layout.replace('<a href="apps.html">EPHOD PH app</a>','<a href="apps.html">EPHOD PNG app</a>')
if os.path.exists(DIST): shutil.rmtree(DIST)
os.makedirs(DIST)
for d in ('css','js','images'):
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
for f in sorted(os.listdir(os.path.join(SRC,'pages'))):
    if not f.endswith('.html'): continue
    s=open(os.path.join(SRC,'pages',f),encoding='utf-8').read()
    m=re.match(r'\s*<!--\s*(\{.*?\})\s*-->\s*',s,flags=re.S)
    meta=json.loads(m.group(1)); body=s[m.end():]
    html=layout
    for k in ('title','description','page'): html=html.replace('{{%s}}'%k,meta.get(k,''))
    html=html.replace('{{body_attrs}}',meta.get('body_attrs','')).replace('{{year}}',year).replace('{{content}}',body)
    for js in ('js/seminars.js','js/course.js'):
        html=html.replace('src="%s"'%js,'src="%s"'%stamp(js))
    open(os.path.join(DIST,f),'w',encoding='utf-8').write(html)
# devotions data
posts=json.load(open(os.path.join(ROOT,'tools','devotions_full.json'),encoding='utf-8'))
posts.sort(key=lambda p:p['date'],reverse=True)
dd=os.path.join(DIST,'data','devotions'); os.makedirs(dd)
index=[{k:p[k] for k in ('slug','title','date','reading','image','excerpt')} for p in posts]
json.dump(index,open(os.path.join(dd,'index.json'),'w',encoding='utf-8'),ensure_ascii=False)
for p in posts:
    json.dump(p,open(os.path.join(dd,p['slug']+'.json'),'w',encoding='utf-8'),ensure_ascii=False)
json.dump(posts,open(os.path.join(dd,'all.json'),'w',encoding='utf-8'),ensure_ascii=False)
# version-stamp the entry pages' assets too (they are cached for an hour)
for folder in ENTRY:
  ad=os.path.join(DIST,folder)
  for f in os.listdir(ad):
    if not (f.endswith('.html') or f.endswith('.php')) or f in ('api.php','config.php'): continue
    fp=os.path.join(ad,f); s=open(fp,encoding='utf-8').read()
    s=s.replace('href="../css/themes.css"','href="../%s"'%stamp('css/themes.css')).replace('href="../css/site.css"','href="../%s"'%stamp('css/site.css'))
    s=s.replace('href="admin.css"','href="%s"'%stamp('admin/admin.css').replace('admin/','')).replace('src="admin.js"','src="%s"'%stamp('admin/admin.js').replace('admin/',''))
    open(fp,'w',encoding='utf-8').write(s)
# robots.txt and sitemap.xml for the live domain
open(os.path.join(DIST,'robots.txt'),'w').write("User-agent: *\nDisallow: /memoryverse/\nDisallow: /goldnugget/\nDisallow: /source/\nAllow: /\nSitemap: %s/sitemap.xml\n"%SITE_URL)
pages=[f for f in sorted(os.listdir(DIST)) if f.endswith('.html') and f not in ('404.html','devotion.html','certificate.html','seminar.html')]
urls=[SITE_URL+'/']+[SITE_URL+'/'+f for f in pages if f!='index.html']+[SITE_URL+'/devotion.html?slug='+p['slug'] for p in posts]
today=datetime.date.today().isoformat()
open(os.path.join(DIST,'sitemap.xml'),'w',encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>%s</loc><lastmod>%s</lastmod></url>\n'%(u,today) for u in urls)+'</urlset>\n')
shutil.copy(os.path.join(SRC,'README-DEPLOY.md'),os.path.join(DIST,'README-DEPLOY.md'))
print("built",len(posts),"devotions;",len([f for f in os.listdir(DIST) if f.endswith('.html')]),"pages")
