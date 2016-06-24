import swPrecache from 'sw-precache';
import path from 'path';

const VERBOSE = process.argv.includes('--verbose');
const rootDir = path.join(__dirname, '../build/public');

async function precache() {
  return new Promise(resolve => {
    swPrecache.write(`${rootDir}/service-worker.js`, {
      // Stuff you want to cache for App Shell, in this case
      // everything after we built/copied to build/public directory
      staticFileGlobs: [`${rootDir}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,json}`],
      verbose: VERBOSE,
      runtimeCaching: [
        {
          urlPattern: "'/graphql'",
          handler: 'networkFirst',
        },
        {
          // This ReGex allows caching of everything EXCEPT: hot-updates.
          // Blacklisting it allows HMR to properly update
          urlPattern: '"*"',
          handler: 'fastest',
        },
      ],
      stripPrefix: rootDir,
      importScripts: ['sw-toolbox.js'],
    }, output => resolve(output));
  });
}

export default precache;
