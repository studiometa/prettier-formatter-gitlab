#!/usr/bin/env node
import { exec } from 'node:child_process';
import { prettierFormatterGitLab } from '../src/index.js';

const cmd = process.argv[2];

if (cmd) {
  exec(cmd, async (error, stdout, stderr) => {
    if (error) {
      console.log(error.message);
      await prettierFormatterGitLab(stdout + stderr);
      process.exit(1);
    }
  });
}
