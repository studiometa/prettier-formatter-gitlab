#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { env } from 'node:process';
import { dirname } from 'node:path';
import { diff } from './formatters/diff.js';
import { gitlab } from './formatters/gitlab.js';
import { parse } from './utils/parse-prettier-results.js';
import { getOutputPath } from './utils/get-output-path.js';

/**
 * Format Prettier results for GitLab Code Quality Reports.
 * @param   {string} results
 * @returns {Promise<void>}
 */
export async function prettierFormatterGitLab(results) {
  const { CI_JOB_NAME, PRETTIER_CODE_QUALITY_REPORT } = env;
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
