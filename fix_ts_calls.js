const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix invalid function calls
    content = content.replace(/fn\(req:\s*Request,\s*res:\s*Response,\s*next:\s*NextFunction\)/g, 'fn(req, res, next)');
    content = content.replace(/\(\{([^}:]+)\}:\s*any\)/g, '({$1}: any)'); // Fix destructured any

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
