#!/usr/bin/env node
const { exec } = require('child_process');
const prettierFormatterGitlab = require('../src/index.js');

const [, , cmd] = process.argv;

exec(cmd, async (error) => {
  if (error) {
    console.log(error.message);
    await prettierFormatterGitlab(error);
    process.exit(1);
  }
});
