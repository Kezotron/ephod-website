#!/usr/bin/env python3
"""Build the EPHOD static site: src/ -> dist/."""
import json, os, re, shutil, sys, datetime
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'src'); DIST=os.path.join(ROOT,'dist')
layout=open(os.path.join(SRC,'layout.html'),encoding='utf-8').read()
if os.path.exists(DIST): shutil.rmtree(DIST)
os.makedirs(DIST)
for d in ('css','js','images'):
    shutil.copytree(os.path.join(SRC,d),os.path.join(DIST,d))
shutil.copy(os.path.join(SRC,'favicon.svg'),DIST)
shutil.copytree(os.path.join(SRC,'admin'),os.path.join(DIST,'admin-ephod-entry'))
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
shutil.copy(os.path.join(SRC,'README-DEPLOY.md'),os.path.join(DIST,'README-DEPLOY.md'))
print("built",len(posts),"devotions;",len([f for f in os.listdir(DIST) if f.endswith('.html')]),"pages")
