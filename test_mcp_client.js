import { spawn } from 'child_process';
import path from 'path';

// Simple MCP client test
const serverProcess = spawn('node', ['dist/mcp/server.js'], {
  cwd: path.resolve('d:\\NodeJsProjects\\api-project'),
  stdio: ['pipe', 'pipe', 'pipe']
});

let responseBuffer = '';

serverProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  console.log('Server output:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.log('Server stderr:', data.toString());
});

// Wait a bit for server to start
setTimeout(() => {
  console.log('Sending MCP initialize message...');

  // Send MCP initialize message
  const initMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  serverProcess.stdin.write(JSON.stringify(initMessage) + '\n');
}, 1000);

// Clean up after 5 seconds
setTimeout(() => {
  serverProcess.kill();
}, 5000);