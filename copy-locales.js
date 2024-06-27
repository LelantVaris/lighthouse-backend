const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'node_modules/lighthouse/shared/localization/locales');
const destDir = path.join(__dirname, 'locales');

function copyFiles(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    fs.copyFileSync(srcFile, destFile);
  }
}

copyFiles(srcDir, destDir);
