// this just copies newest bs-components docs to the docs project dedicated to it
const fs = require('fs');
const path = require('path');
const del = require('del');
const ncp = require('ncp');

const docsProjectPath = path.join(__dirname, '..', '..', '..', 'bs-components.github.io');

// console.log('docsProjectPath: ', docsProjectPath);

if (!fs.existsSync(docsProjectPath)) {
  console.log(`${docsProjectPath} path does not exist`);
  return;
}

del.sync([
  `${docsProjectPath}/*`,
  `!${path.join(docsProjectPath, '.git')}`,
  `!${path.join(docsProjectPath, '_config.yml')}`,
], { force: true } );

const source = path.join(__dirname, 'dist');
ncp(source, docsProjectPath, (err) => {
  'use strict';

  if (err) {
    console.log('Unable to copy bs-components build to docs folder');
    console.log('source: ', source);
    console.log('docsProjectPath: ', docsProjectPath);
    console.error(err);
  }
});
