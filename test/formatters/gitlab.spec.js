import { describe, it, expect } from 'bun:test';
import { resolve } from 'node:path';
import { gitlab } from '../../src/formatters/gitlab.js';

describe('The gitlab formatter', () => {
  it('should return gitlab formatted reports about the given files', async () => {
    const filepath = resolve(import.meta.dirname, '../__stubs__/dirty.js');
    const results = await gitlab([filepath]);
    expect(results).toMatchSnapshot();
  });

  it('should handle files with syntax errors', async () => {
    const filepath = resolve(import.meta.dirname, '../__stubs__/syntax-error.js');
    const results = await gitlab([filepath]);
    expect(results).toMatchSnapshot();
  });
});
