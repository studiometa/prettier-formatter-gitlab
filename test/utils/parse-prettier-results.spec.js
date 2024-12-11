import { describe, it, expect } from 'bun:test';
import { parse } from '../../src/utils/parse-prettier-results.js';

describe('The parse function', () => {
  it('should parse output of the `prettier -c` command', () => {
    const output = `Checking formatting...
[warn] test/__stubs__/dirty-2.js
[warn] test/__stubs__/dirty.js
[warn] Code style issues found in 2 files. Run Prettier to fix.`;

    expect(parse(output)).toEqual(['test/__stubs__/dirty-2.js', 'test/__stubs__/dirty.js']);
  });

  it('should parse output of the `prettier --list-different` command', () => {
    const output = `test/__stubs__/dirty-2.js
test/__stubs__/dirty.js`;

    expect(parse(output)).toEqual(['test/__stubs__/dirty-2.js', 'test/__stubs__/dirty.js']);
  });

  it('should handle syntax errors', () => {
    const output = `Checking formatting...
[warn] test/__stubs__/dirty-2.js
[warn] test/__stubs__/dirty.js
[error] test/__stubs__/syntax-error.js: SyntaxError: Unexpected token, expected "(" (3:13)
[error]   1 | /* eslint-disable */
[error]   2 |
[error] > 3 | function foo#####( arg  ) {
[error]     |             ^
[error]   4 |   return arg;
[error]   5 | }
[error]   6 |
[warn] Code style issues found in 2 files. Run Prettier to fix.`;

    expect(parse(output)).toEqual([
      'test/__stubs__/dirty-2.js',
      'test/__stubs__/dirty.js',
      'test/__stubs__/syntax-error.js',
    ]);

    const output2 = `test/__stubs__/dirty-2.js
test/__stubs__/dirty.js
[error] test/__stubs__/syntax-error.js: SyntaxError: Unexpected token, expected "(" (3:13)
[error]   1 | /* eslint-disable */
[error]   2 |
[error] > 3 | function foo#####( arg  ) {
[error]     |             ^
[error]   4 |   return arg;
[error]   5 | }
[error]   6 |
`;

    expect(parse(output2)).toEqual([
      'test/__stubs__/dirty-2.js',
      'test/__stubs__/dirty.js',
      'test/__stubs__/syntax-error.js',
    ]);
  });
});
