const fs = require('fs');
const { exec } = require('child_process');

const CODE_QUALITY_FILENAME = 'gl-prettier-codequality.json';
const CODE_QUALITY_CONTENT = `[
  {
    "description": "Replace ·arg·· with arg",
    "fingerprint": "1d79c88b09a5f9a74066153a2cd1ed51",
    "location": {
      "path": "test/dirty-2.js",
      "lines": {
        "begin": 3
      }
    }
  },
  {
    "description": "Insert ;",
    "fingerprint": "2bb8592ca39a0aa14f0d921df191fee0",
    "location": {
      "path": "test/dirty-2.js",
      "lines": {
        "begin": 5
      }
    }
  },
  {
    "description": "Replace ⏎⏎⏎⏎⏎⏎function·foo(·arg··)·{⏎⏎ with function·foo(arg)·{",
    "fingerprint": "cee24b7bbda1802ccd201d34af330b2d",
    "location": {
      "path": "test/dirty.js",
      "lines": {
        "begin": 3
      }
    }
  },
  {
    "description": "Delete ⏎⏎⏎",
    "fingerprint": "cee351690a2f3b77ef97bc0389bc8d6f",
    "location": {
      "path": "test/dirty.js",
      "lines": {
        "begin": 12
      }
    }
  }
]`;

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
