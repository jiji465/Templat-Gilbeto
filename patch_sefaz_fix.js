const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

// Fix the edge case where saidas = 0 but entradas > 0. It should be 100% risk, so let's set propSefaz to 100.1% or just force isSefazRisk
const oldSefaz = /const propSefaz = saidas > 0 \? \(entradas \/ saidas\) \* 100 : \(entradas > 0 \? 100 : 0\);/;
const newSefaz = `const propSefaz = saidas > 0 ? (entradas / saidas) * 100 : (entradas > 0 ? 999 : 0);`;

code = code.replace(oldSefaz, newSefaz);

fs.writeFileSync(path, code);
