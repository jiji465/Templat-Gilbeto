require('ts-node').register();
const { calcFatorR, autoCalc, INIT_DATA } = require('./utils/taxCalculations.ts');
console.log(calcFatorR(280000, 1000000));
const data = { ...INIT_DATA, folha: '280.000,00', rbt12: '1.000.000,00' };
data.revenues = [
  { id: 1, type: 'Serviços', anexo: 'Anexo V', label: 'Serviços', value: '100.000,00', isST: false, isMono: false, isISSRetido: false }
];
const result = autoCalc(data);
console.log(result.map(r => r.fatorREcon));
