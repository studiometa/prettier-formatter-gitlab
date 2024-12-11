import chalk from 'chalk';
import { diffStringsUnified } from 'jest-diff';
import { getPrettierFileInfos } from '../utils/get-prettier-file-infos.js';

/**
 * @typedef {import('../types.d.ts').FileInfo} FileInfo
 */

/**
 * Format Prettier formatting errors in diff format.
 * @param {Partial<FileInfo>} fileInfo A file Prettier informations.
 * @returns {string}
 */
function formatDiff({ filename, input, output, error } = {}) {
  let diff = `----------------------------------------------------
${filename}
----------------------------------------------------
`;

  if (error) {
    diff += String(error);
  } else {
    diff += diffStringsUnified(input || '', output || '', {
      aColor: chalk.red,
      bColor: chalk.green,
      omitAnnotationLines: true,
      contextLines: 2,
      expand: false,
    });
  }

  diff += '\n';

  return diff;
}

/**
 * Diff formatter.
 * @param   {string[]} files
 * @returns {Promise<void>}
 */
export async function diff(files) {
  const infos = await Promise.all(files.map((file) => getPrettierFileInfos(file)));
  return infos.map((info) => formatDiff(info));
}
