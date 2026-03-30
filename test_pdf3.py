from playwright.sync_api import sync_playwright
import time

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    # Click on "Calcular Apuração"
    page.get_by_text("Calcular Apuração").click()
    page.wait_for_timeout(2000)

    # Click on "Prévia do Relatório"
    page.get_by_text("Prévia do Relatório").click()
    page.wait_for_timeout(5000)

    # Take a screenshot
    page.screenshot(path="/home/jules/verification/screenshots/verification3.png")
    print("Screenshot saved to /home/jules/verification/screenshots/verification3.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
