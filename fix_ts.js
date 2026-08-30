const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Change export { to export default {
    content = content.replace(/export\s*\{\s*([\s\S]*?)\s*\};/g, (match, p1) => {
        // If it's already an alias or complex export, keep it. But for simple ones, default export
        if (p1.includes(' as ')) return match;
        return `export default { ${p1} };`;
    });

    // Add Request, Response, NextFunction imports if needed
    if ((content.includes('req') || content.includes('res') || content.includes('next')) && !content.includes('from \'express\'') && !content.includes('from "express"')) {
        content = `import { Request, Response, NextFunction } from 'express';\n` + content;
    }

    // Type req, res, next in controllers and middlewares
    // req, res, next -> req: Request, res: Response, next: NextFunction
    content = content.replace(/\(req\s*,\s*res\)/g, '(req: Request, res: Response)');
    content = content.replace(/\(req\s*,\s*res\s*,\s*next\)/g, '(req: Request, res: Response, next: NextFunction)');
    content = content.replace(/\(err\s*,\s*req\s*,\s*res\s*,\s*next\)/g, '(err: any, req: Request, res: Response, next: NextFunction)');
    content = content.replace(/\(req,\s*file,\s*cb\)/g, '(req: Request, file: Express.Multer.File, cb: any)');

    // Fix implicit any for simple parameters in services
    content = content.replace(/\(email\)/g, '(email: string)');
    content = content.replace(/\(email: string, otp\)/g, '(email: string, otp: string)');
    content = content.replace(/\(email: string, otp: string, newPassword\)/g, '(email: string, otp: string, newPassword: string)');
    content = content.replace(/\(userId, payload\)/g, '(userId: string, payload: any)');
    content = content.replace(/\(adminId, payload\)/g, '(adminId: string, payload: any)');
    content = content.replace(/\(serviceId\)/g, '(serviceId: string)');
    content = content.replace(/\(serviceId: string, payload\)/g, '(serviceId: string, payload: any)');
    content = content.replace(/\(publicId\)/g, '(publicId: string)');
    content = content.replace(/\(buffer\)/g, '(buffer: Buffer)');
    content = content.replace(/\(user\)/g, '(user: any)');
    content = content.replace(/\(to,\s*subject,\s*text\)/g, '(to: string, subject: string, text: string)');

    // Destructured parameters like ({ email, password, fullName... }) -> ({ email, password, fullName... }: any)
    content = content.replace(/\(\{\s*email,\s*password,\s*fullName/g, '({ email, password, fullName }: any'); // simplify, actually let's just replace all destructuring with : any
    content = content.replace(/async\s*\(\{(.*?)\}\)/g, 'async ({$1}: any)');

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
