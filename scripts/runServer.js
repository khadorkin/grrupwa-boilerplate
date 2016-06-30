import { spawn } from 'child_process';
import path from 'path';
import webpackConfig from '../webpack.config.js';

const { output } = webpackConfig[1];
const serverPath = path.join(output.path, output.filename);
let server;

function runServer(cb) {
  function onStdOut(data) {
    process.stderr.write(data);
    if (cb) {
      cb(null);
    }
  }

  if (server) {
    server.kill('SIGTERM');
  }

  server = spawn('node', [serverPath], {
    env: Object.assign({ NODE_ENV: 'development' }, process.env),
    silent: false,
  });

  server.stdout.on('data', onStdOut);
  server.stderr.on('data', x => process.stderr.write(x));

  return server;
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

export default runServer;
