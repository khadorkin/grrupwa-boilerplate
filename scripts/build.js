import webpack from 'webpack';
import serverConfig from '../webpack.config.server.js';
import clientConfig from '../webpack.config.client.js';

async function build() {
  return new Promise((resolve, reject) => {
    webpack(serverConfig).run((errServer, serverStats) => {
      if (errServer) reject(errServer);
      console.log(serverStats.toString(serverStats.stats));
      webpack(clientConfig).run((errClient, clientStats) => {
        if (errClient) reject(errClient);
        console.log(clientStats.toString(clientConfig.stats));
        resolve();
      });
    });
  });
}

export default build;
