import { readFileSync } from 'node:fs';
import { relative, dirname } from 'node:path';
import {
  resolveConfig,
  resolveConfigFile,
  getFileInfo as prettierGetFileInfo,
  check,
  format,
} from 'prettier';

/**
 * @typedef {import('../types.d.ts').FileInfo} FileInfo
 */

/**
 * Get Prettier file informations.
 * @param {string} filePath The absolute path to the file.
 * @returns {FileInfo} An object with Prettier informations.
 */
export default async function getFileInfo(filePath) {
  const input = readFileSync(filePath, 'utf8').toString();
  const [options, configPath] = await Promise.all([
    resolveConfig(filePath),
    resolveConfigFile(filePath),
  ]);
  const infos = await prettierGetFileInfo(filePath, options);
  const filename = relative(dirname(configPath), filePath);

  if (!options.parser) {
    options.parser = infos.inferredParser;
  }

  const [isFormatted, output] = await Promise.all([check(input, options), format(input, options)]);

  return {
    filename,
    input,
    output,
    isFormatted,
  };
}
