#!/usr/bin/env node
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { cwd, env } from 'node:process';
import { join, resolve, dirname } from 'node:path';
import yaml from 'js-yaml';
import { diff } from './formatters/diff.js';
import { gitlab } from './formatters/gitlab.js';
import { parse } from './utils/parse-prettier-results.js';

const {
  // Used as a fallback for local testing.
  CI_CONFIG_PATH = '.gitlab-ci.yml',
  CI_JOB_NAME,
  CI_PROJECT_DIR = cwd(),
} = env;

/**
 * Get the output path for the report file.
 * @returns {string}
 */
function getOutputPath() {
  const jobs = yaml.load(readFileSync(join(CI_PROJECT_DIR, CI_CONFIG_PATH), 'utf-8'));
  const { artifacts } = jobs[CI_JOB_NAME];
  const location = artifacts && artifacts.reports && artifacts.reports.codequality;
  const msg = `Expected ${CI_JOB_NAME}.artifacts.reports.codequality to be one exact path`;
  if (!location) {
    throw new Error(`${msg}, but no value was found.`);
  }
  if (Array.isArray(location)) {
    throw new Error(`${msg}, but found an array instead.`);
  }
  return resolve(CI_PROJECT_DIR, location);
}

/**
 * Format Prettier results for GitLab Code Quality Reports.
 * @param   {string} results
 * @returns {Promise<void>}
 */
export async function prettierFormatterGitLab(results) {
  const { PRETTIER_CODE_QUALITY_REPORT } = env;
  if (CI_JOB_NAME || PRETTIER_CODE_QUALITY_REPORT) {
    const files = parse(results);

    const [data, diffs] = await Promise.all([gitlab(files), diff(files)]);
    diffs.forEach((diff) => console.log(diff));
    const outputPath = PRETTIER_CODE_QUALITY_REPORT || getOutputPath();
    const dir = dirname(outputPath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
  }
}
