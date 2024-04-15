import { createHash } from 'node:crypto';
import { showInvisibles, generateDifferences } from 'prettier-linter-helpers';
import getFileInfo from '../utils/get-file-info.js';

/**
 * @typedef {import('../types.d.ts').FileInfo} FileInfo
 * @typedef {import('../types.d.ts').CodeQualityReport} CodeQualityReport
 */

/**
 * Create a fingerprint for the given file and error message.
 * @param  {string[]} args
 * @returns {string}
 */
function createFingerprint(...args) {
  const md5 = createHash('md5');
  args.forEach((arg) => {
    md5.update(String(arg));
  });
  return md5.digest('hex');
}

/**
 * Format a file.
 * @param {Partial<FileInfo>} fileInfo
 * @returns {CodeQualityReport}
 */
function formatFile({ filename, input, output }) {
  const { INSERT, DELETE, REPLACE } = generateDifferences;
  const differences = generateDifferences(input, output);

  return differences.map(({ offset, operation, deleteText = '', insertText = '' }) => {
    const deleteCode = showInvisibles(deleteText);
    const insertCode = showInvisibles(insertText);
    const begin = input.slice(0, offset).split('\n').length;
    const endOffset = deleteText.split('\n').length - 1;
    const end = begin + endOffset;

    let message;

    switch (operation) {
      case INSERT:
        message = `Insert ${insertCode}`;
        break;
      case DELETE:
        message = `Delete ${deleteCode}`;
        break;
      case REPLACE:
        message = `Replace ${deleteCode} with ${insertCode}`;
        break;
    }

    return {
      type: 'issue',

      check_name: 'prettier',
      description: message,
      severity: 'minor',
      fingerprint: createFingerprint(filename, message, begin, end),
      location: {
        path: filename,
        lines: {
          begin,
          end,
        },
      },
    };
  });
}

/**
 * GitLab formatter.
 * @param   {string[]} files
 * @returns {Promise<CodeQualityReport[]>}
 */
export async function gitlab(files) {
  const infos = await Promise.all(files.map(getFileInfo));
  return infos.reduce((acc, fileInfo) => [...acc, ...formatFile(fileInfo)], []);
}
