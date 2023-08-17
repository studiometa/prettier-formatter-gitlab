const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

/**
 * Get Prettier file informations.
 * @param {String} filePath The absolute path to the file.
 * @return {Object} An object with Prettier informations.
 */
module.exports = async (filePath) => {
  const input = fs.readFileSync(filePath, 'utf8').toString();
  const options = await prettier.resolveConfig(filePath);
  const configPath = await prettier.resolveConfigFile(filePath);
  const infos = await prettier.getFileInfo(filePath, options);
  const filename = path.relative(path.dirname(configPath), filePath);

  if (!options.parser) {
    options.parser = infos.inferredParser;
  }

  const isFormatted = await prettier.check(input, options);
  const output = await prettier.format(input, options);

  return {
    filename,
    input,
    output,
    isFormatted,
  };
};
