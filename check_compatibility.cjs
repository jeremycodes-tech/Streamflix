const fs = require('fs');
const path = require('path');

const dataPath = 'c:/Users/BUSINESS/Documents/app/src/lib/data.ts';
const dataContent = fs.readFileSync(dataPath, 'utf-8');

const postersDir = 'c:/Users/BUSINESS/Documents/app/public/posters';
const posterFiles = fs.readdirSync(postersDir);

const moviesInData = [];
const matches = [...dataContent.matchAll(/\/posters\/([^'"]+)/g)];

console.log('--- Case Sensitivity & Space Check ---');
matches.forEach(m => {
    const filename = m[1];
    if (filename === 'stranger-things-backdrop.png') return;
    if (!posterFiles.includes(filename)) {
        console.error(`ERROR: Path in data.ts "${filename}" does NOT match any file on disk exactly.`);
        const fuzzyMatch = posterFiles.find(f => f.toLowerCase() === filename.toLowerCase());
        if (fuzzyMatch) {
            console.log(`  -> Hint: Found "${fuzzyMatch}" on disk (Case Mismatch!)`);
        }
    } else if (filename.includes(' ')) {
        console.warn(`WARNING: Filename "${filename}" contains spaces. This may fail on some servers.`);
    }
});
console.log('--- Check Complete ---');
