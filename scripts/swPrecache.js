import swPrecache from 'sw-precache';
import path from 'path';

swPrecache.write(path.join(__dirname, '../src/public/service-worker.js'), {
  staticFileGlobs: [
    `${path.join(__dirname, '../build/public')}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}`,
  ],
  runtimeCaching: [
    {
      urlPattern: "'/*'",
      handler: 'fastest',
    },
  ],
  verbose: true,
}, result => {
  console.log('Result from precaching callback: ', result);
});
