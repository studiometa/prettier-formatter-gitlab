import { describe, it, expect } from 'bun:test';
import { resolve } from 'node:path';
import { getPrettierFileInfos } from '../../src/utils/get-prettier-file-infos.js';

describe('The getPrettierFileInfos function', () => {
  it('should return information about a given file', async () => {
    const filepath = resolve(import.meta.dirname, '../__stubs__/dirty.js');
    const infos = await getPrettierFileInfos(filepath);
    expect(infos).toMatchSnapshot();
  });

  it('should handle files with syntax errors', async () => {
    const filepath = resolve(import.meta.dirname, '../__stubs__/syntax-error.js');
    const infos = await getPrettierFileInfos(filepath);
    expect(infos).toMatchSnapshot();
  });
});
