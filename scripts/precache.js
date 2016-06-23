import swPrecache from 'sw-precache';
import path from 'path';

const VERBOSE = process.argv.includes('--verbose');

async function precache() {
  return new Promise(resolve => {
    swPrecache.write(path.join(__dirname, '../build/public/service-worker.js'), {
      staticFileGlobs: [
        `${path.join(__dirname, '../build/public')}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,json}`,
      ],
      verbose: VERBOSE,
      runtimeCaching: [
        {
          urlPattern: "'/graphql'",
          handler: 'networkFirst',
        },
        {
          urlPattern: "'*'",
          handler: 'fastest',
        },
      ],
      stripPrefix: path.join(__dirname, '../build/public/'),
      importScripts: ['sw-toolbox.js'],
    }, output => resolve(output));
  });
}

export default precache;
