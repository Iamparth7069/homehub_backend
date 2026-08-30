const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Convert requires
    // const x = require('x') -> import x from 'x'
    // const { x, y } = require('x') -> import { x, y } from 'x'
    content = content.replace(/const\s+([^{}\n]+)\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");
    content = content.replace(/const\s+(\{\s*[^}\n]+\s*\})\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");
    
    // Convert let x = require('x')
    content = content.replace(/let\s+([^{}\n]+)\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");
    content = content.replace(/let\s+(\{\s*[^}\n]+\s*\})\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");

    // Convert module.exports
    // module.exports = { x, y } -> export { x, y }
    // module.exports = x -> export default x
    content = content.replace(/module\.exports\s*=\s*\{([^}]+)\};?/g, "export { $1 };");
    content = content.replace(/module\.exports\s*=\s*([^{}\n;]+);?/g, "export default $1;");

    fs.writeFileSync(filePath, content, 'utf8');
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, 'lib'));
