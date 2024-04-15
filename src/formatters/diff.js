import chalk from 'chalk';
import { diffStringsUnified } from 'jest-diff';
import getFileInfo from '../utils/get-file-info.js';

/**
 * @typedef {import('../types.d.ts').FileInfo} FileInfo
 */

/**
 * Format Prettier formatting errors in diff format.
 * @param {Partial<FileInfo>} fileInfo A file Prettier informations.
 */
function formatDiff({ filename, input, output }) {
  console.log(`----------------------------------------------------
${filename}
----------------------------------------------------`);
  console.log(
    diffStringsUnified(input || '', output || '', {
      aColor: chalk.red,
      bColor: chalk.green,
      omitAnnotationLines: true,
      contextLines: 2,
      expand: false,
    }),
  );
  console.log('');
}

/**
 * Diff formatter.
 * @param   {string[]} files
 * @returns {Promise<void>}
 */
export async function diff(files) {
  const infos = await Promise.all(files.map(getFileInfo));
  infos.forEach(formatDiff);
}
