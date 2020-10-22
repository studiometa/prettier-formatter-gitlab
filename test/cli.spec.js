const fs = require('fs');
const { exec } = require('child_process');

const CODE_QUALITY_FILENAME = 'gl-prettier-codequality.json';
const CODE_QUALITY_CONTENT = `[
  {
    "description": "[Prettier] Code style issues found",
    "fingerprint": "5f081f857e81dff313576a035fd63828",
    "location": {
      "path": "test/dirty.js"
    }
  }
]`;

afterEach(() => {
  fs.unlinkSync(CODE_QUALITY_FILENAME);
});

describe('prettier-formatter-gitlab cli', () => {
  it('should create a code quality report file', (done) => {
    exec(
      `PRETTIER_CODE_QUALITY_REPORT="${CODE_QUALITY_FILENAME}" ./bin/cli.js "prettier -c test"`,
      () => {
        expect(fs.existsSync(CODE_QUALITY_FILENAME)).toBe(true);
        const content = fs.readFileSync(CODE_QUALITY_FILENAME);
        expect(content.toString()).toBe(CODE_QUALITY_CONTENT);
        done();
      }
    );
  });
});
