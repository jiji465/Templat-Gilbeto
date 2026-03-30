const fs = require('fs');

// Patch page.tsx
const pagePath = 'app/page.tsx';
let pageCode = fs.readFileSync(pagePath, 'utf8');
pageCode = pageCode.replace(/Total Entradas Ano/g, 'Total Entradas Mês');
pageCode = pageCode.replace(/Total Saídas Ano/g, 'Total Saídas Mês');
fs.writeFileSync(pagePath, pageCode);

// Patch RelatorioPDF.tsx
const pdfPath = 'components/RelatorioPDF.tsx';
let pdfCode = fs.readFileSync(pdfPath, 'utf8');
pdfCode = pdfCode.replace(/do ano\. Quando as entradas/g, 'do mês. Quando as entradas');
fs.writeFileSync(pdfPath, pdfCode);
