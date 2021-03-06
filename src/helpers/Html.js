import React from 'react';

type Props = {
  criticalCss: string,
  markup: string,
  preloadedData: string,
  head: Object,
  assets: Object,
}

const Html = ({ markup, preloadedData, head, criticalCss, assets }: Props) => (
  <html>
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf-8" />
      <title>GRRUPWA Boilerplate</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="manifest" href="manifest.json" />
      <meta name="theme-color" content="#7acc9c" />

      <link rel="shortcut icon" href="img/favicon.ico" />
      <link rel="apple-touch-icon" sizes="57x57" href="img/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="img/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="img/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="img/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="img/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="img/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon-180x180.png" />
      <link rel="icon" type="image/png" href="img/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="img/android-chrome-192x192.png" sizes="192x192" />
      <link rel="icon" type="image/png" href="img/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/png" href="img/favicon-16x16.png" sizes="16x16" />
      <link rel="manifest" href="img/manifest.json" />
      <link rel="mask-icon" href="img/safari-pinned-tab.svg" color="#7acc9c" />
      <meta name="msapplication-TileColor" content="#267F4B" />
      <meta name="msapplication-TileImage" content="img/mstile-144x144.png" />
      <meta name="theme-color" content="#7acc9c" />
      <meta name="msapplication-config" content="img/browserconfig.xml" />
      <style type="text/css" dangerouslySetInnerHTML={{ __html: criticalCss }} />
      {/* This snippet is taken from loadCSS.
        We inline it here to async load css files below */}
      <script dangerouslySetInnerHTML={{ __html: '!function(e){"use strict";var n=function(n,t,o){function i(e){return a.body?e():void setTimeout(function(){i(e)})}function r(){l.addEventListener&&l.removeEventListener("load",r),l.media=o||"all"}var d,a=e.document,l=a.createElement("link");if(t)d=t;else{var s=(a.body||a.getElementsByTagName("head")[0]).childNodes;d=s[s.length-1]}var f=a.styleSheets;l.rel="stylesheet",l.href=n,l.media="only x",i(function(){d.parentNode.insertBefore(l,t?d:d.nextSibling)});var u=function(e){for(var n=l.href,t=f.length;t--;)if(f[t].href===n)return e();setTimeout(function(){u(e)})};return l.addEventListener&&l.addEventListener("load",r),l.onloadcssdefined=u,u(r),l};"undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this);' }} />
      {!__DEV__ && <script dangerouslySetInnerHTML={{ __html: 'loadCSS(\'/css/styles.css\');' }} />}
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
      <script
        id="preloadedData"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(preloadedData).replace(/\//g, '\\/') }}
      />
      <script src={assets.main.js}></script>
      <script
        dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js', { scope: './' })
              .then(function(registration) {
                registration.onupdatefound = function() {
                  if (navigator.serviceWorker.controller) {
                    var installingWorker = registration.installing;

                    installingWorker.onstatechange = function() {
                      switch (installingWorker.state) {
                        case 'installed':
                          console.log('Service Worker installed.');
                          break;
                        case 'redundant':
                          throw new Error('The installing ' +
                                          'service worker became redundant.');
                        default:
                          // Ignore
                      }
                    };
                  }
                };
              }).catch(function(e) {
                console.error('Error during service worker registration:', e);
              });
          } else {
            console.log('service worker is not supported');
          }` }}
        charSet="UTF-8"
      />
    </body>
  </html>
);

export default Html;
