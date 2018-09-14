// this just copies newest bscomponents build to docs public assets folder

const path = require('path');
const del = require('del');
const ncp = require('ncp');

del.sync([
  path.join(__dirname, 'public', 'assets', 'js', 'bscomponents.js'),
  path.join(__dirname, 'public', 'assets', 'js', 'bscomponents'),
]);

const source = path.join(__dirname, '..', '..', 'www', 'build');
const destination = path.join(__dirname, 'public', 'assets', 'js');

ncp(source, destination, (err) => {
  'use strict';

  if (err) {
    console.log('Unable to copy bs-components build to docs folder');
    console.log('source: ', source);
    console.log('destination: ', destination);
    console.error(err);
  }
});
