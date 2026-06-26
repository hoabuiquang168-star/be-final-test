import fs from 'fs';
import path from 'path';

const backendDir = 'e:/Final-Text/notes-app/backend';

const filesToProcess = [
  'index.js',
  'src/config/db.js',
  'src/controllers/auth.controller.js',
  'src/controllers/teacher.controller.js',
  'src/controllers/teacherPosition.controller.js',
  'src/middlewares/auth.middleware.js',
  'src/middlewares/error.middleware.js',
  'src/middlewares/role.middleware.js',
  'src/models/teacher.model.js',
  'src/models/teacherPosition.model.js',
  'src/models/user.model.js',
  'src/routes/auth.route.js',
  'src/routes/index.js',
  'src/routes/teacher.route.js',
  'src/routes/teacherPosition.route.js',
  'src/utils/response.js'
];

for (const relPath of filesToProcess) {
  const filePath = path.join(backendDir, relPath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace `const { ... } = require(...)`
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\((['"])(.*?)\2\);?/g, (match, vars, q, moduleName) => {
    let newMod = moduleName;
    if (newMod.startsWith('.')) {
      if (!newMod.endsWith('.js')) {
        newMod += '.js';
      }
    }
    return `import {${vars}} from "${newMod}";`;
  });

  // Replace `const ... = require(...)`
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"])(.*?)\2\);?/g, (match, varName, q, moduleName) => {
    let newMod = moduleName;
    if (newMod.startsWith('.')) {
      if (newMod.endsWith('/index')) {
        newMod += '.js';
      } else if (!newMod.endsWith('.js')) {
        newMod += '.js';
      }
    }
    return `import ${varName} from "${newMod}";`;
  });

  // Replace `require(...)`
  content = content.replace(/require\((['"])(.*?)\1\)(\.config\(\))?;?/g, (match, q, moduleName, configCall) => {
    if (moduleName === 'dotenv' && configCall) {
      return `import "dotenv/config";`;
    }
    return match;
  });

  // Replace `module.exports = { ... }`
  content = content.replace(/module\.exports\s*=\s*\{([^}]+)\};?/g, (match, vars) => {
    return `export {${vars}};`;
  });

  // Replace `module.exports = ...`
  content = content.replace(/module\.exports\s*=\s*([^;]+);?/g, (match, varName) => {
    if (varName.includes('{')) {
      return match;
    }
    return `export default ${varName};`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${relPath}`);
}
