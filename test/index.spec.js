import { describe, it, expect, afterEach, spyOn } from 'bun:test';
import { existsSync, unlinkSync } from 'node:fs';
import { prettierFormatterGitLab } from '../src/index.js';

const CODE_QUALITY_FILENAME = 'gl-prettier-codequality.json';

afterEach(() => {
  if (existsSync(CODE_QUALITY_FILENAME)) {
    unlinkSync(CODE_QUALITY_FILENAME);
  }
});

describe('The prettierFormatterGitLab function', () => {
  it('should work with the `-c` or `-l` flag', async () => {
    const consoleSpy = spyOn(console, 'log');
    consoleSpy.mockImplementation(() => null);
    process.env.PRETTIER_CODE_QUALITY_REPORT = CODE_QUALITY_FILENAME;

    // prettier -c path/to/folder/
    const outputCheck = `Checking formatting...
[warn] test/__stubs__/dirty-2.js
[warn] test/__stubs__/dirty.js
test/__stubs__/syntax-error.js
[error] test/__stubs__/syntax-error.js: SyntaxError: Unexpected token, expected "(" (3:13)
[error]   1 | /* eslint-disable */
[error]   2 |
[error] > 3 | function foo#####( arg  ) {
[error]     |             ^
[error]   4 |   return arg;
[error]   5 | }
[error]   6 |
[warn] Code style issues found in 2 files. Run Prettier to fix.
`;

    // prettier -l path/to/folder/
    const outputList = `test/__stubs__/dirty-2.js
test/__stubs__/dirty.js
test/__stubs__/syntax-error.js
`;

    await prettierFormatterGitLab(outputCheck);
    await prettierFormatterGitLab(outputList);
    expect(consoleSpy.mock.calls).toMatchSnapshot();
    consoleSpy.mockRestore();
  });
});
