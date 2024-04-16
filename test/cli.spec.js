import { describe, it, expect, afterEach, spyOn } from 'bun:test';
import { existsSync, unlinkSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { prettierFormatterGitLab } from '../src/index.js';

const CODE_QUALITY_FILENAME = 'gl-prettier-codequality.json';

afterEach(() => {
  if (existsSync(CODE_QUALITY_FILENAME)) {
    unlinkSync(CODE_QUALITY_FILENAME);
  }
});

describe('prettier-formatter-gitlab cli', () => {
  it('should create a code quality report file', () => {
    try {
      execSync(
        `PRETTIER_CODE_QUALITY_REPORT="${CODE_QUALITY_FILENAME}" ./bin/cli.js "prettier -l test"`,
      );
    } catch (err) {
      // Silence is golden.
    }

    expect(existsSync(CODE_QUALITY_FILENAME)).toBe(true);
    const content = readFileSync(CODE_QUALITY_FILENAME);
    expect(content.toString()).toMatchSnapshot();
  });

  it('should work with the `-c` or `-l` flag', async () => {
    const consoleSpy = spyOn(console, 'log');
    consoleSpy.mockImplementation(() => null);
    process.env.PRETTIER_CODE_QUALITY_REPORT = CODE_QUALITY_FILENAME;

    // prettier -c path/to/folder/
    const outputCheck = `Checking formatting...
[warn] test/dirty-2.js
[warn] test/dirty.js
[warn] Code style issues found in 3 files. Run Prettier to fix.
`;

    // prettier -l path/to/folder/
    const outputList = `test/dirty-2.js
test/dirty.js
`;

    await prettierFormatterGitLab(outputCheck);
    await prettierFormatterGitLab(outputList);
    expect(consoleSpy).toHaveBeenCalledTimes(12);
    expect(consoleSpy.mock.calls.slice(0, 6)).toEqual(consoleSpy.mock.calls.slice(6, 12));
    consoleSpy.mockRestore();
  });
});
