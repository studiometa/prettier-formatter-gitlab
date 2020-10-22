#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const {
  // Used as a fallback for local testing.
  CI_CONFIG_PATH = '.gitlab-ci.yml',
  CI_JOB_NAME,
  CI_PROJECT_DIR = process.cwd(),
  PRETTIER_CODE_QUALITY_REPORT,
} = process.env;

/**
 * Get the output path for the report file.
 * @return {String}
 */
function getOutputPath() {
  const jobs = yaml.load(fs.readFileSync(path.join(CI_PROJECT_DIR, CI_CONFIG_PATH), 'utf-8'));
  const { artifacts } = jobs[CI_JOB_NAME];
  const location = artifacts && artifacts.reports && artifacts.reports.codequality;
  const msg = `Expected ${CI_JOB_NAME}.artifacts.reports.codequality to be one exact path`;
  if (!location) {
    throw new Error(`${msg}, but no value was found.`);
  }
  if (Array.isArray(location)) {
    throw new Error(`${msg}, but found an array instead.`);
  }
  return path.resolve(CI_PROJECT_DIR, location);
}

/**
 * Create a fingerprint for the given file and error message.
 * @param  {String} filePath
 * @param  {String} message
 * @return {String}
 */
function createFingerprint(filePath, message) {
  const md5 = crypto.createHash('md5');
  md5.update(filePath);
  md5.update(message);
  return md5.digest('hex');
}

/**
 * Parse the `prettier --check` output to format a GitLab Code Quality report JSON.
 * @param  {String}        results The output of a `prettier --check` failing command.
 * @return {Array<Object>}
 */
function parse(results) {
  return results
    .toString()
    .split('\n')
    .filter((line) => line.startsWith('[warn]') && !line.includes('Code style issues found'))
    .map((line) => line.replace('[warn] ', ''))
    .map((filePath) => ({
      description: '[Prettier] Code style issues found',
      fingerprint: createFingerprint(filePath, '[Prettier] Code style issues found'),
      location: {
        path: filePath,
      },
    }));
}

module.exports = (results) => {
  if (CI_JOB_NAME || PRETTIER_CODE_QUALITY_REPORT) {
    const data = parse(results);

    const outputPath = PRETTIER_CODE_QUALITY_REPORT || getOutputPath();
    const dir = path.dirname(outputPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  }
};
