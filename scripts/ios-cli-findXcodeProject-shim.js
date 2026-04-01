'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const shimPath = path.join(
  root,
  'node_modules',
  '@react-native-community',
  'cli-platform-ios',
  'build',
  'config',
  'findXcodeProject.js',
);

const content = `'use strict';
module.exports = require('@react-native-community/cli-config-apple/build/config/findXcodeProject');
`;

function main() {
  const realModule = path.join(
    root,
    'node_modules',
    '@react-native-community',
    'cli-config-apple',
    'build',
    'config',
    'findXcodeProject.js',
  );
  if (!fs.existsSync(realModule)) {
    console.warn(
      '[postinstall] ios-cli-findXcodeProject-shim: skipped (cli-config-apple not found)',
    );
    return;
  }
  const dir = path.dirname(shimPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(shimPath, content, 'utf8');
}

main();
