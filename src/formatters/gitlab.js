const crypto = require('crypto');
const { showInvisibles, generateDifferences } = require('prettier-linter-helpers');

const getFileInfo = require('../utils/get-file-info.js');

/**
 * Create a fingerprint for the given file and error message.
 *
 * @param  {string[]} ...args
 * @return {string}
 */
function createFingerprint(...args) {
  const md5 = crypto.createHash('md5');
  args.forEach((arg) => {
    md5.update(String(arg));
  });
  return md5.digest('hex');
}

/**
 * [formatFile description]
 * @param {[type]} { filename, input, output } [description]
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
    // eslint-disable-next-line default-case
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

module.exports = async (files) => {
  const infos = await Promise.all(files.map(getFileInfo));
  return infos.reduce((acc, fileInfo) => [...acc, ...formatFile(fileInfo)], []);
};
