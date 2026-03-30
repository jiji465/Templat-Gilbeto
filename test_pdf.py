from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    def handle_console(msg):
        print(f"BROWSER LOG: {msg.text}")

    def handle_error(err):
        print(f"BROWSER ERROR: {err}")

    page.on("console", handle_console)
    page.on("pageerror", handle_error)

    page.goto("http://localhost:3000")
    print("Navigated to localhost:3000")

    # Click on "2. PRÉVIA DO RELATÓRIO"
    page.locator("text='2. PRÉVIA DO RELATÓRIO'").click()
    print("Clicked on '2. PRÉVIA DO RELATÓRIO'")

    # Wait to see if error pops up
    page.wait_for_timeout(5000)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
