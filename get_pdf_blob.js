const { chromium } = require('playwright');
// In JS so we can download the blob
(async () => {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext({ recordVideo: { dir: '/home/jules/verification/videos' } });
    const page = await context.newPage();

    await page.goto("http://localhost:3000");
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
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
    });

    await page.waitForTimeout(500);

    // Click on "Executar Apuração"
    await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for(let b of buttons) {
            if(b.innerText.includes('EXECUTAR APURAÇÃO')) {
                b.click();
            }
        }
    });

    await page.waitForTimeout(2000);

    // Instead of clicking "Prévia", let's wait for the "Baixar PDF" button to be ready and click it to trigger download.
    // The link might be an <a> element with text "Baixar PDF" (PDFDownloadLink)
    await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        for(let a of links) {
            if(a.innerText.includes('Baixar PDF')) {
                // To avoid navigating away we can fetch the blob
                console.log('Found download link:', a.href);
            }
        }
    });

    // We can intercept the download
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.evaluate(() => {
            const links = document.querySelectorAll('a');
            for(let a of links) {
                if(a.innerText.includes('Baixar PDF')) {
                    a.click();
                }
            }
        })
    ]);

    await download.saveAs('/home/jules/verification/screenshots/relatorio.pdf');
    console.log("PDF downloaded to /home/jules/verification/screenshots/relatorio.pdf");

    // To take a screenshot, maybe we can use pdf2image or just stick to the iframe screenshot
    // Since we're in JS, let's close the browser
    await context.close();
    await browser.close();
})();
