const fs = require('fs');
const { exec } = require('child_process');

const CODE_QUALITY_FILENAME = 'gl-prettier-codequality.json';

afterEach(() => {
  if (fs.existsSync(CODE_QUALITY_FILENAME)) {
    fs.unlinkSync(CODE_QUALITY_FILENAME);
  }
});

describe('prettier-formatter-gitlab cli', () => {
  it('should create a code quality report file', (done) => {
    exec(
      `PRETTIER_CODE_QUALITY_REPORT="${CODE_QUALITY_FILENAME}" ./bin/cli.js "prettier -c test"`,
      () => {
        expect(fs.existsSync(CODE_QUALITY_FILENAME)).toBe(true);
        const content = fs.readFileSync(CODE_QUALITY_FILENAME);
        expect(content.toString()).toMatchSnapshot();
        done();
      }
    );
  });
});
