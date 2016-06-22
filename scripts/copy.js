/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import gaze from 'gaze';
import Promise from 'bluebird';

const DEBUG = !process.argv.includes('--release');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy({ watch } = {}) {
  const ncp = Promise.promisify(require('ncp'));

  await Promise.all([
    ncp('src/public', 'build/public'),
  ]);

  if (DEBUG || watch) {
    const watcher = await new Promise((resolve, reject) => {
      gaze('src/public/**/*.*', (err, val) => err ? reject(err) : resolve(val));
    });

    const cp = async (file) => {
      const relPath = file.substr(path.join(__dirname, '../src/public/').length);
      await ncp(`src/public/${relPath}`, `build/public/${relPath}`);
    };

    watcher.on('changed', cp);
    watcher.on('added', cp);
  }
}

export default copy;
