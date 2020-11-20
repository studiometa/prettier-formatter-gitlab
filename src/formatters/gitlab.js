const crypto = require('crypto');
const { showInvisibles, generateDifferences } = require('prettier-linter-helpers');

const getFileInfo = require('../utils/get-file-info.js');

/**
 * Create a fingerprint for the given file and error message.
 * @param  {String} filePath
 * @param  {String} message
 * @return {String}
 */
function createFingerprint(filePath, message) {
  const md5 = crypto.createHash('md5');
  md5.update(filePath);
  md5.update(message);
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
    const line = input.slice(0, offset).split('\n').length;

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
      description: message,
      fingerprint: createFingerprint(filename, message),
      location: {
        path: filename,
        lines: {
          begin: line,
        },
      },
    };
  });
}

module.exports = async (files) => {
  const infos = await Promise.all(files.map(getFileInfo));
  return infos.reduce((acc, fileInfo) => [...acc, ...formatFile(fileInfo)], []);
};
