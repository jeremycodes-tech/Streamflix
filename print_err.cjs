const fs = require('fs');
const txt = fs.readFileSync('build_err.txt', 'utf16le');
const lines = txt.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('error TS') || lines[i].includes('Error:')) {
    console.log(`[L${i}] ${lines[i].trim()}`);
    // print context
    console.log(`  > ${lines[i-1]?.trim()}`);
    console.log(`  > ${lines[i+1]?.trim()}`);
  }
}
