#!/usr/bin/env python3
"""Tiny stand-in for the EPHOD API with the same response shapes, for local testing."""
import json, random
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
BOOKS=[("GEN","Genesis"),("EXO","Exodus"),("ISA","Isaiah"),("MAT","Matthew"),("1TI","1st Timothy"),("PSA","Psalms")]
VI={"abbreviation":"ASV","language":"english","version":"American Standard Version","info_url":"","publisher":"","copyright":"Public Domain"}
def verses(n,start=1): return [{"number":start+i,"text":"Lorem ipsum verse text %d, the word of the Lord endureth for ever and ever amen."%(start+i)} for i in range(n)]
class H(BaseHTTPRequestHandler):
    def log_message(self,*a): pass
    def do_GET(self):
        u=urlparse(self.path); q={k:v[0] for k,v in parse_qs(u.query).items()}; p=u.path.rsplit('/',1)[-1]
        day=int(q.get('day',289)); ver=q.get('version','t_asv')
        if p=='get_daily_reading_plan.php': out={"success":True,"amReading":"Isaiah %d-%d"%(day%60,day%60+1),"pmReading":"1st Timothy %d"%(day%6+1),"dayOfYear":day}
        elif p in('am_bible_reading.php','pm_bible_reading.php'): out={"success":True,"day":day,"version":ver,"reference":"Isaiah 44-45","bookName":"Isaiah","chapters":[{"number":44,"verses":verses(28)},{"number":45,"verses":verses(25)}],"versionInfo":[]}
        elif p=='get_memory_verse.php': out={"success":True,"dateRange":"October 12 to October 18, 2026","reference":"Isaiah 41:10 (American Standard Version)","version":"American Standard Version","verses":[{"verseNumber":"10","text":"fear thou not, for I am with thee; be not dismayed, for I am thy God; I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."}]}
        elif p=='get_golden_nugget.php': out={"success":True,"day":day,"reference":"1st Timothy 2:8","referenceWithVersion":"1st Timothy 2:8 (ASV)","book":"1st Timothy","chapter":2,"verseStart":8,"verseEnd":8,"version":ver,"versionInfo":VI,"verses":[{"number":8,"text":"I desire therefore that the men pray in every place, lifting up holy hands, without wrath and disputing."}]}
        elif p=='get_past_memory_verses.php': out={"success":True,"currentWeek":42,"count":13,"memoryVerses":[{"week":42-i,"reference":"Isaiah 41:%d"%(10+i),"version":ver,"versionAbbr":"ASV","verses":verses(1,10+i)} for i in range(13)]}
        elif p=='get_past_golden_nuggets.php': out={"success":True,"currentDay":day,"count":30,"goldenNuggets":[{"day":day-i,"date":"October %d"%(16-i if i<16 else 1),"reference":"Psalms %d:1"%(100+i),"version":ver,"versionAbbr":"ASV","verses":verses(1)} for i in range(30)]}
        elif p=='get_bible_books.php': out={"success":True,"language":"English","count":len(BOOKS),"books":[{"id":i,"number":n+1,"name":nm} for n,(i,nm) in enumerate(BOOKS)]}
        elif p=='export_reading_plan.php':
            rp=[]
            for d in range(1,367): rp.append({"id":d,"fbook":"GEN","fchapter":d,"fverse":1,"lbook":"GEN","lchapter":d+1,"lverse":0,"pmfbook":"MAT","pmfchapter":d%28+1,"pmfverse":1 if d%3 else 5,"pmlbook":"MAT","pmlchapter":d%28+1,"pmlverse":0 if d%3 else 20})
            out={"success":True,"planDays":366,"bookCount":66,"readingPlan":rp}
        else: out={"success":False,"error":"unknown endpoint "+p}
        b=json.dumps(out).encode()
        self.send_response(200); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Content-Length',str(len(b))); self.end_headers(); self.wfile.write(b)
HTTPServer(('127.0.0.1',8787),H).serve_forever()
