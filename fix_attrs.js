const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/<View key=\{i\} wrap=\{false\} style=\{\[styles\.tableRow, \{ backgroundColor: rowBgColor \}\]\} wrap=\{false\}>/g, '<View key={i} wrap={false} style={[styles.tableRow, { backgroundColor: rowBgColor }]}>');

fs.writeFileSync(path, code);
