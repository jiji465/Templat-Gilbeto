from playwright.sync_api import sync_playwright
import re

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    # Simple form fill and calculate
    page.evaluate('''() => {
        const inputs = document.querySelectorAll('input');
        for(let i of inputs) {
            if(i.placeholder === 'Nome da Empresa') i.value = 'Cliente Fator R Teste';
            if(i.placeholder === '00.000.000/0000-00') i.value = '12.345.678/0001-90';
            if(i.className.includes('text-primary') && i.type === 'text') i.value = '20000,00';
            if(i.placeholder === '0,00') i.value = '6000,00';
            i.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
            checkboxes[0].click(); // Fator R checkbox
        }

        const selects = document.querySelectorAll('select');
        for(let s of selects) {
            if(s.innerHTML.includes('Anexo V')) {
                s.value = 'Anexo V';
                s.dispatchEvent(new Event('change', { bubbles: true }));
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

    # Instead of "PRÉVIA", we will just click "Baixar PDF" if we can, or we can just download the blob
    page.evaluate('''() => {
        const buttons = document.querySelectorAll('button');
        for(let b of buttons) {
            if(b.innerText.includes('PRÉVIA DO RELATÓRIO')) {
                b.click();
            }
        }
    }''')
    page.wait_for_timeout(5000)

    page.screenshot(path="/home/jules/verification/screenshots/verification_iframe.png")

    # The pdf viewer inside the iframe cannot be screenshotted directly easily from playwright if it is rendered by PDFViewer using canvas.
    # But let's check the size of the pdf download link just in case

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
