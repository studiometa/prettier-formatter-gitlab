/**
 * Parse the `prettier --list-different` output to format a GitLab Code Quality report JSON.
 * @param  {string} results The output of a `prettier --list-different` failing command.
 * @returns {Array<string>}
 */
export function parse(results) {
  const files = new Set();
  let errorIndex = 0;

  for (const line of results.split('\n')) {
    if (
      line.trim() === '' ||
      line.startsWith('Checking formatting...') ||
      line.startsWith('Error occurred when') ||
      line.includes('Code style issues found')
    ) {
      continue;
    }

    if (line.startsWith('[error]')) {
      if (errorIndex === 0) {
        const [maybeFile] = line.split(':');
        files.add(maybeFile.replace('[error]', '').trim());
      }
      errorIndex += 1;
      continue;
    } else {
      errorIndex = 0;
    }

    files.add(line.replace('[warn] ', '').trim());
  }

  return Array.from(files);
}
