#!/usr/bin/env node
const { exec } = require('child_process');
const prettierFormatterGitlab = require('../src/index.js');

const [, , cmd] = process.argv;

exec(cmd, async (error, stdout) => {
  if (error) {
    console.log(error.message);
    await prettierFormatterGitlab(stdout);
    process.exit(1);
  }
});
