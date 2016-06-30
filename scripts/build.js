import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';

async function build() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig[1]).run((errServer, serverStats) => {
      if (errServer) reject(errServer);
      console.log(serverStats.toString(webpackConfig[1].stats));
      webpack(webpackConfig[0]).run((errClient, clientStats) => {
        if (errClient) reject(errClient);
        console.log(clientStats.toString(webpackConfig[0].stats));
        resolve();
      });
    });
  });
}

export default build;
