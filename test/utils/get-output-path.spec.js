import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { resolve, join } from 'node:path';
import { getOutputPath } from '../../src/utils/get-output-path.js';

let env;

beforeEach(() => {
  env = process.env;
});

afterEach(() => {
  process.env = env;
});

describe('The getPrettierFileInfos function', () => {
  it('should return the output path defined in a .gitlab-ci.yml file', () => {
    process.env.CI_PROJECT_DIR = resolve(join(import.meta.dirname, '../__stubs__/'));
    process.env.CI_JOB_NAME = 'prettier';
    console.log(process.env.CI_PROJECT_DIR);
    expect(getOutputPath()).toBe(
      resolve(join(import.meta.dirname, '../__stubs__/gl-codequality.json')),
    );
  });

  it('should throw an error if it can not find the report file path', () => {
    process.env.CI_PROJECT_DIR = resolve(join(import.meta.dirname, '../__stubs__/'));
    process.env.CI_JOB_NAME = 'prettier';
    process.env.CI_CONFIG_PATH = '.gitlab-ci.fail.yml';
    expect(getOutputPath).toThrow();
  });

  it('should throw an error if it can not find a .gitlab-ci.yml file', () => {
    process.env.CI_PROJECT_DIR = '/tmp';
    expect(getOutputPath).toThrow();
  });
});
