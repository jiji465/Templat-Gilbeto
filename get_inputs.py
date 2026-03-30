from playwright.sync_api import sync_playwright

def run(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    inputs = page.evaluate('''() => {
        return Array.from(document.querySelectorAll('input')).map(i => ({
            type: i.type,
            placeholder: i.placeholder,
            name: i.name,
            id: i.id,
            className: i.className
        }));
    }''')
    print("Inputs:", inputs)

    buttons = page.evaluate('''() => {
        return Array.from(document.querySelectorAll('button')).map(b => ({
            text: b.innerText,
            className: b.className
        }));
    }''')
    print("Buttons:", buttons)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run(page)
        browser.close()
