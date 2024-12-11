import { describe, it, expect, afterEach } from 'bun:test';
import { existsSync, unlinkSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const CODE_QUALITY_FILENAME = 'gl-prettier-codequality.json';

afterEach(() => {
  if (existsSync(CODE_QUALITY_FILENAME)) {
    unlinkSync(CODE_QUALITY_FILENAME);
  }
});

describe('prettier-formatter-gitlab cli', () => {
  it('should create a code quality report file with prettier -l', () => {
    try {
      execSync(
        `PRETTIER_CODE_QUALITY_REPORT="${CODE_QUALITY_FILENAME}" ./bin/cli.js "prettier -l test/__stubs__/"`,
      );
    } catch (err) {
      // Silence is golden.
    }

    expect(existsSync(CODE_QUALITY_FILENAME)).toBe(true);
    const content = JSON.parse(readFileSync(CODE_QUALITY_FILENAME).toString());
    expect(content).toMatchSnapshot();
  });

  it('should create a code quality report file with prettier -c', () => {
    try {
      execSync(
        `PRETTIER_CODE_QUALITY_REPORT="${CODE_QUALITY_FILENAME}" ./bin/cli.js "prettier -c test/__stubs__/"`,
      );
    } catch (err) {
      // Silence is golden.
    }

    expect(existsSync(CODE_QUALITY_FILENAME)).toBe(true);
    const content = JSON.parse(readFileSync(CODE_QUALITY_FILENAME).toString());
    expect(content).toMatchSnapshot();
  });
});
