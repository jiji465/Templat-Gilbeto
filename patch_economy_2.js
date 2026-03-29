const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<Text style=\{styles\.heroBadgeSub\}>Dentro das normas do Simples Nacional<\/Text>/g;
const replacement = "<Text style={styles.heroBadgeSub}>Dentro das normas {data?.regime === 'Simples Nacional' ? 'do Simples Nacional' : 'legais vigentes'}</Text>";

code = code.replace(regex, replacement);

fs.writeFileSync(path, code);
