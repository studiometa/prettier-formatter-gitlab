import { describe, it, expect } from 'bun:test';
import { resolve } from 'node:path';
import stripAnsi from 'strip-ansi';
import { diff } from '../../src/formatters/diff.js';

describe('The diff formatter', () => {
  it('should return diff formatted reports about the given files', async () => {
    const filepath = resolve(import.meta.dirname, '../__stubs__/dirty.js');
    const results = await diff([filepath]);
    expect(stripAnsi(results.join('\n'))).toMatchSnapshot();
  });

  it('should handle files with syntax errors', async () => {
    const filepath = resolve(import.meta.dirname, '../__stubs__/syntax-error.js');
    const results = await diff([filepath]);
    expect(stripAnsi(results.join('\n'))).toMatchSnapshot();
  });
});
