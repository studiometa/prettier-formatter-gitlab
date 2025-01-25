import { readFileSync, existsSync, lstatSync } from 'node:fs';
import { cwd, env } from 'node:process';
import { join, resolve } from 'node:path';
import { parseDocument } from 'yaml';

/** @type {yaml.CollectionTag} */
const referenceTag = {
  tag: '!reference',
  collection: 'seq',
  default: false,
  resolve() {
    // We only allow the syntax. We don’t actually resolve the reference.
  },
};

/**
 * Get the output path for the report file.
 * @returns {string}
 */
export function getOutputPath() {
  const {
    // Used as a fallback for local testing.
    CI_CONFIG_PATH = '.gitlab-ci.yml',
    CI_JOB_NAME,
    CI_PROJECT_DIR = cwd(),
  } = env;

  const configPath = join(CI_PROJECT_DIR, CI_CONFIG_PATH);

  if (!existsSync(configPath) || !lstatSync(configPath).isFile()) {
    throw new Error(
      'Could not resolve .gitlab-ci.yml to automatically detect report artifact path.' +
        ' Please manually provide a path via the ESLINT_CODE_QUALITY_REPORT variable.',
    );
  }

  const doc = parseDocument(readFileSync(configPath, 'utf-8'), {
    version: '1.1',
    customTags: [referenceTag],
  });

  const path = [CI_JOB_NAME, 'artifacts', 'reports', 'codequality'];
  const location = doc.getIn(path);

  if (typeof location !== 'string' || !location) {
    throw new TypeError(
      `Expected ${path.join('.')} to be one exact path, got: ${JSON.stringify(location)}`,
    );
  }

  return resolve(CI_PROJECT_DIR, location);
}
