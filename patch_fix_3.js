const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<View style=\{styles\.stepCard\}>\s*<View style=\{\[styles\.stepNumberBox, \{ backgroundColor: colors\.primary \}\]\}>\s*<Text style=\{styles\.stepNumberText\}>02<\/Text>\s*<\/View>\s*<View style=\{styles\.stepContent\}>\s*<Text style=\{styles\.stepTitle\}>Alíquota Efetiva Reduzida<\/Text>\s*<Text style=\{styles\.stepText\}>\s*O enquadramento no Anexo III resultou em alíquota efetiva de \{cargaEfetiva\.toFixed\(2\)\.replace\('\.',','\)\}%[\s\S]*?<\/View>\s*<\/View>\s*<View style=\{styles\.stepCard\}>\s*<View style=\{\[styles\.stepNumberBox, \{ backgroundColor: colors\.primary \}\]\}>\s*<Text style=\{styles\.stepNumberText\}>03<\/Text>\s*<\/View>\s*<View style=\{styles\.stepContent\}>\s*<Text style=\{styles\.stepTitle\}>Planejamento 100% Legal e Seguro<\/Text>[\s\S]*?<\/View>\s*<\/View>\s*<\/View>\s*<View style=\{\{ marginTop: 10, padding: 10, backgroundColor: '#eef2e6'/;

const replacement = `<View style={{ marginTop: 10, padding: 10, backgroundColor: '#eef2e6'`;

code = code.replace(regex, replacement);

fs.writeFileSync(path, code);
