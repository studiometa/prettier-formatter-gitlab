const chalk = require('chalk');
const { diffStringsUnified } = require('jest-diff');
const getFileInfo = require('../utils/get-file-info.js');

/**
 * Format Prettier formatting errors in diff format.
 * @param {Object} { filename, input, output } A file Prettier informations.
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
    })
  );
  console.log('');
}

module.exports = async (files) => {
  const infos = await Promise.all(files.map(getFileInfo));
  infos.forEach(formatDiff);
};
