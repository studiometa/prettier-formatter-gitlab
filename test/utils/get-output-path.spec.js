import { describe, it, expect } from 'bun:test';
import { resolve, join } from 'node:path';
import { getOutputPath } from '../../src/utils/get-output-path.js';

describe('The getPrettierFileInfos function', () => {
  it('should return the output path defined in a .gitlab-ci.yml file', () => {
    process.env.CI_PROJECT_DIR = resolve(join(import.meta.dirname, '../__stubs__/'));
    process.env.CI_JOB_NAME = 'prettier';
    console.log(process.env.CI_PROJECT_DIR);
    expect(getOutputPath()).toBe(
      resolve(join(import.meta.dirname, '../__stubs__/gl-codequality.json')),
    );
  });
});
