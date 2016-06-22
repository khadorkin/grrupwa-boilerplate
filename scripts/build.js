import webpack from 'webpack';
import serverConfig from '../webpack.config.server.js';
import clientConfig from '../webpack.config.client.js';

const build = () => {
  webpack(serverConfig).run((errServer, serverStats) => {
    if (errServer) console.log(errServer);
    console.log(serverStats.toString(clientConfig.stats));
    webpack(clientConfig).run((errClient, clientStats) => {
      if (errClient) console.log(errClient);
      console.log(clientStats.toString(clientConfig.stats));
    });
  });
};

build();
export default build;
