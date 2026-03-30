from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    # Fill in a client name
    page.fill("input[placeholder='Digite o nome do cliente']", "Cliente Fator R Teste")
    page.wait_for_timeout(500)

    # Fill CNPJ
    page.fill("input[placeholder='00.000.000/0001-00']", "12.345.678/0001-90")
    page.wait_for_timeout(500)

    # Change to Simples Nacional
    page.select_option("select[name='regime']", "Simples Nacional")
    page.wait_for_timeout(500)

    # Check "Sujeito ao Fator R"
    # Find the input checkbox for Fator R and check it
    page.locator("input[type='checkbox']").nth(0).check()
    page.wait_for_timeout(500)

    # Put some Revenue
    # Wait for the revenue input
    page.fill("input[placeholder='R$ 0,00']", "20000,00")
    page.wait_for_timeout(500)

    # Put Folha de Salários
    page.fill("input[placeholder='Valor da Folha (R$)']", "6000,00")
    page.wait_for_timeout(500)

    # Click on "Executar Apuração"
    page.get_by_text("Executar Apuração").click()
    page.wait_for_timeout(2000)

    # Click on "Prévia do Relatório"
    page.get_by_text("Prévia do Relatório").click()
    page.wait_for_timeout(5000)

    # Wait for iframe or blob link
    page.screenshot(path="/home/jules/verification/screenshots/verification4.png")
    print("Screenshot saved to /home/jules/verification/screenshots/verification4.png")

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
