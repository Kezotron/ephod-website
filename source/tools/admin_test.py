import asyncio
from playwright.async_api import async_playwright
B="http://127.0.0.1:8788/memoryverse/"
S="/tmp/claude-0/-home-claude/b602244f-d7b9-522b-95d8-07b2cd469a4b/scratchpad/shots/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":1100,"height":900}); page=await ctx.new_page()
        errs=[]; page.on("pageerror",lambda e: errs.append(str(e))); page.on("dialog",lambda d: d.accept())
        # memory verse
        await page.goto(B+"memory-verse.html"); await page.wait_for_timeout(1500)
        await page.select_option("select[name=book]","PSA"); await page.wait_for_timeout(600)
        await page.select_option("select[name=chapter]","103"); await page.wait_for_timeout(600)
        await page.select_option("select[name=verse]","11"); await page.select_option("select[name=lastverse]","12")
        await page.click("#preview-btn"); await page.wait_for_timeout(800)
        await page.click("button[type=submit]"); await page.wait_for_timeout(1200)
        print("MV status:", await page.locator("#status").inner_text()); print("MV current:", (await page.locator("#current").inner_text())[:120])
        await page.screenshot(path=S+"admin-memory-verse.png",full_page=True)
        # gold nugget
        await page.goto(B+"gold-nugget.html"); await page.wait_for_timeout(1500)
        await page.click("#months button[data-m='9']"); await page.click("#days button[data-d='290']"); await page.wait_for_timeout(1000)
        print("GN current:", await page.locator("#current").inner_text())
        await page.click("#days button[data-d='291']"); await page.wait_for_timeout(800)
        await page.select_option("select[name=book]","GEN"); await page.wait_for_timeout(600); await page.select_option("select[name=chapter]","1"); await page.wait_for_timeout(600)
        await page.click("button[type=submit]"); await page.wait_for_timeout(1000)
        print("GN status:", await page.locator("#status").inner_text(), "| count:", await page.locator("#count").inner_text())
        await page.screenshot(path=S+"admin-gold-nugget.png",full_page=True)
        # devotions
        await page.goto(B+"devotions.html"); await page.wait_for_timeout(1500)
        await page.fill("#f-title","A Test Devotion"); await page.fill("#f-reading","John 3:1 through 4:54")
        await page.click("#f-body"); await page.keyboard.type("First paragraph of the devotion."); await page.keyboard.press("Enter"); await page.keyboard.type("For God so loved the world (John 3:16).")
        await page.set_input_files("#f-image","/home/claude/ephod-site/src/images/small-groups.webp")
        await page.click("#save-btn"); await page.wait_for_timeout(2000)
        print("DEVO status:", await page.locator("#status").inner_text())
        await page.screenshot(path=S+"admin-devotions.png",full_page=True)
        # verify on public site
        await page.goto("http://127.0.0.1:8788/devotion.html?slug=a-test-devotion"); await page.wait_for_timeout(1200)
        print("PUBLIC:", (await page.locator("#devotion").inner_text())[:200].replace("\n"," | "))
        print("img:", await page.locator("#devotion img").count())
        await page.goto("http://127.0.0.1:8788/devotions.html"); await page.wait_for_timeout(1200)
        print("COUNT on site:", await page.locator("#devo-count").inner_text())
        print("errors:",errs)
        await b.close()
asyncio.run(main())
