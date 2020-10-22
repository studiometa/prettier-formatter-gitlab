#!/usr/bin/env node
const { exec } = require('child_process');
const prettierFormatterGitlab = require('../src/index.js');

const [, , cmd] = process.argv;

exec(cmd, (error) => {
  if (error) {
    prettierFormatterGitlab(error);
    console.log(error.toString());
    process.exit(1);
  }
});
