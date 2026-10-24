#!/usr/bin/env node
/**
 * REA CLI Runner Adapter for Antigravity Workspace
 * Bridges terminal execution with rea-agents
 */

const { spawn } = require('child_process');

const args = process.argv.slice(2);
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const child = spawn(npxCmd, ['-y', 'rea-agents@6.7.0', ...args], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    REA_MCP_INPUT_SCHEMA_PROFILE: 'compact',
  },
});

child.on('close', (code) => {
  process.exit(code || 0);
});
