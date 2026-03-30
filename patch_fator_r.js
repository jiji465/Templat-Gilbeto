const fs = require('fs');
let code = fs.readFileSync('components/RelatorioPDF.tsx', 'utf-8');

// Fator R logic
// Add totalFatorREcon computation to the top
const compStr = `    const totalEcon = taxesList.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);`;
const addStr = `    const totalEcon = taxesList.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);\n    const totalFatorREcon = taxesList.reduce((s: number, t: any) => s + (t.fatorREcon || 0), 0);`;
code = code.replace(compStr, addStr);

fs.writeFileSync('components/RelatorioPDF.tsx', code);
