from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    # Fill in a client name
    page.fill("input[placeholder='Nome da Empresa']", "Cliente Fator R Teste")
    page.wait_for_timeout(500)

    # Change to Simples Nacional (this depends on the select name or class, let's skip for now if it defaults to Simples Nacional)

    # Let's find the Fator R checkbox by evaluating the DOM
    page.evaluate('''() => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
            checkboxes[0].click(); // isST
            checkboxes[1].click(); // isMono
            checkboxes[2].click(); // isISSRetido
        }
    }''')
    page.wait_for_timeout(500)

    # Change first revenue type to Anexo V
    page.evaluate('''() => {
        const selects = document.querySelectorAll('select');
        // The first select is probably regime, the second is type, the third is anexo
        // Let's just find the select with options Anexo III, Anexo IV, Anexo V
        for(let s of selects) {
            if(s.innerHTML.includes('Anexo V')) {
                s.value = 'Anexo V';
                s.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }''')

    # Fill first revenue value (which has class containing 'text-primary')
    page.evaluate('''() => {
        const inputs = document.querySelectorAll('input');
        for(let i of inputs) {
            if(i.className.includes('text-primary') && i.type === 'text') {
                i.value = '20000,00';
                i.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
        }
    }''')
    page.wait_for_timeout(500)

    # Fill Folha de Salarios (last input according to get_inputs.py is placeholder 0,00 but wait, there are other inputs)
    # Let's evaluate to set folha de salarios
    page.evaluate('''() => {
        const inputs = document.querySelectorAll('input');
        // Fator R folha de salários input is probably one of the font-mono inputs. Let's find it by placeholder.
        for(let i of inputs) {
            if(i.placeholder === '0,00') {
                i.value = '6000,00';
                i.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }''')
    page.wait_for_timeout(500)

    # Click on "Executar Apuração"
    page.evaluate('''() => {
        const buttons = document.querySelectorAll('button');
        for(let b of buttons) {
            if(b.innerText.includes('EXECUTAR APURAÇÃO')) {
                b.click();
            }
        }
    }''')
    page.wait_for_timeout(2000)

    # Click on "Prévia do Relatório"
    page.evaluate('''() => {
        const buttons = document.querySelectorAll('button');
        for(let b of buttons) {
            if(b.innerText.includes('PRÉVIA DO RELATÓRIO')) {
                b.click();
            }
        }
    }''')
    page.wait_for_timeout(5000)

    page.screenshot(path="/home/jules/verification/screenshots/verification5.png")
    print("Screenshot saved to /home/jules/verification/screenshots/verification5.png")

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
