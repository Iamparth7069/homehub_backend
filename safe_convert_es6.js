const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix folder paths in require statements before converting them
    content = content.replace(/middlewares\//g, 'middleware/');
    content = content.replace(/utils\//g, 'util/');
    content = content.replace(/validators\//g, 'validations/');

    // 2. Convert const { x } = require('y') -> import { x } from 'y'
    content = content.replace(/const\s+(\{\s*[^}\n]+\s*\})\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");
    content = content.replace(/let\s+(\{\s*[^}\n]+\s*\})\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");

    // 3. Convert const x = require('y') -> import x from 'y'
    content = content.replace(/const\s+([^{}\n]+)\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");
    content = content.replace(/let\s+([^{}\n]+)\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, "import $1 from '$3';");

    // 4. Handle const x = require('y').z -> import y from 'y'; const x = y.z; OR just keep require since esModuleInterop is on
    // Let's just fix the module.exports

    // 5. Convert module.exports = { x, y } -> export default { x, y }
    // This allows import authService from '../services/auth.service' to work seamlessly
    content = content.replace(/module\.exports\s*=\s*\{([\s\S]+?)\};?/g, "export default { $1 };");
    
    // 6. Convert module.exports = x -> export default x
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
