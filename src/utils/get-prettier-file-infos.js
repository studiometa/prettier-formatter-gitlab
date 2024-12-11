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
 * @returns {Promise<FileInfo>} An object with Prettier informations.
 */
async function getFileInfos(filePath) {
  const input = readFileSync(filePath, 'utf8').toString();
  const [options, configPath] = await Promise.all([
    resolveConfig(filePath),
    resolveConfigFile(filePath),
  ]);
  const filename = relative(dirname(configPath), filePath);
  const infos = await prettierGetFileInfo(filePath, options);

  if (!options.parser) {
    options.parser = infos.inferredParser;
  }

  try {
    const [isFormatted, output] = await Promise.all([
      check(input, options),
      format(input, options),
    ]);

    return {
      filename,
      input,
      output,
      isFormatted,
    };
  } catch (error) {
    return {
      filename,
      error,
    };
  }
}

const cache = new Map();

/**
 * Get Prettier information for a given file.
 * @param   {string} filePath The absolute path to the file.
 * @returns {Promise<FileInfo>}
 */
export async function getPrettierFileInfos(filePath) {
  if (!cache.has(filePath)) {
    const fileInfo = await getFileInfos(filePath);
    cache.set(filePath, fileInfo);
  }

  return cache.get(filePath);
}
