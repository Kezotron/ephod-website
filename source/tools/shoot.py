import asyncio, sys, json
from playwright.async_api import async_playwright
BASE="http://127.0.0.1:8788/"
PAGES=["index.html","am-reading.html","pm-reading.html?day=366","catch-up.html","reading-plan.html","memory-verse.html","gold-nugget.html","devotions.html","devotion.html?slug=checkmate","about.html","apps.html","seminars.html","contact.html","privacy-policy.html"]
async def main():
    theme=sys.argv[1] if len(sys.argv)>1 else "morning"
    width=int(sys.argv[2]) if len(sys.argv)>2 else 1280
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":width,"height":900}); page=await ctx.new_page()
        errs=[]
        page.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        page.on("pageerror",lambda e: errs.append(str(e)))
        for u in PAGES:
            await page.goto(BASE+u+("&" if "?" in u else "?")+"theme="+theme); await page.wait_for_timeout(1200)
            name=u.split("?")[0].replace(".html","")+("-"+u.split("slug=")[1] if "slug=" in u else "")
            await page.screenshot(path=f"/tmp/claude-0/-home-claude/b602244f-d7b9-522b-95d8-07b2cd469a4b/scratchpad/shots/{theme}-{width}-{name}.png",full_page=True)
            loading=await page.locator(".loading").count(); notice=await page.locator(".notice").count()
            print(f"{u}: loading={loading} notices={notice}")
        print("console errors:",errs)
        await b.close()
asyncio.run(main())
