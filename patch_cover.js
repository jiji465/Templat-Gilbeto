const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove INTELIGÊNCIA FISCAL PRO
code = code.replace(/<Text style=\{styles\.coverTitle\}>INTELIGÊNCIA<\/Text>\n\s*<Text style=\{styles\.coverTitle\}>FISCAL PRO<\/Text>/g, '');

// 2. Replace "Relatório Customizado para:" with "APURAÇÃO FISCAL"
code = code.replace(/<Text style=\{styles\.coverClientLabel\}>Relatório Customizado para:<\/Text>/g, '<Text style={styles.coverClientLabel}>APURAÇÃO FISCAL</Text>');

// 3. Remove DOCUMENTO ESTRATÉGICO DE PERFORMANCE
code = code.replace(/<Text style=\{styles\.coverVersion\}>Documento Estratégico de Performance · v\{VERSION\}<\/Text>/g, '');

fs.writeFileSync(path, code);
