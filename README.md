# @studiometa/prettier-formatter-gitlab

[![NPM Version](https://img.shields.io/npm/v/@studiometa/prettier-formatter-gitlab.svg?style=flat&colorB=3e63dd&colorA=414853)](https://www.npmjs.com/package/@studiometa/prettier-formatter-gitlab/)
[![Downloads](https://img.shields.io/npm/dm/@studiometa/prettier-formatter-gitlab?style=flat&colorB=3e63dd&colorA=414853)](https://www.npmjs.com/package/@studiometa/prettier-formatter-gitlab/)
[![Size](https://img.shields.io/bundlephobia/minzip/@studiometa/prettier-formatter-gitlab?style=flat&colorB=3e63dd&colorA=414853&label=size)](https://bundlephobia.com/package/@studiometa/prettier-formatter-gitlab)
[![Dependency Status](https://img.shields.io/librariesio/release/npm/@studiometa/prettier-formatter-gitlab?style=flat&colorB=3e63dd&colorA=414853)](https://david-dm.org/studiometa/prettier-formatter-gitlab)
![Codecov](https://img.shields.io/codecov/c/github/studiometa/prettier-formatter-gitlab?style=flat&colorB=3e63dd&colorA=414853)

Send Prettier errors to Gitlab's Code Quality reports.

## Installation

Install the package with NPM:

```bash
npm install -D @studiometa/prettier-formatter-gitlab
```

## Usage

Prettier does not have an option for custom reporter, this package will run a prettier CLI command for you and parse its result to generate the Code Quality report.

```js
prettier-formatter-gitlab 'prettier -l src/'
```

The report file path will be read from the `PRETTIER_CODE_QUALITY_REPORT` environment variable or from the `.gitlab-ci.yml` configuration file when using the code quality report artifacts:

```yaml
# .gitlab-ci.yml
prettier:
  image: node:20
  script:
    - npm ci
    - npx prettier-formatter-gitlab 'prettier -l src/'
  artifacts:
    reports:
      codequality: gl-codequality.json
```

## Notes

This project is heavily inspired and borrows some function to the [`eslint-formatter-gitlab`](https://gitlab.com/remcohaszing/eslint-formatter-gitlab) package.
