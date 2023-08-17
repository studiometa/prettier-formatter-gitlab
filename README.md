# Prettier formatter for GitLab Code Quality

[![NPM Version](https://img.shields.io/npm/v/@studiometa/prettier-formatter-gitlab.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/prettier-formatter-gitlab/)
[![Dependency Status](https://img.shields.io/david/studiometa/prettier-formatter-gitlab.svg?label=deps&style=flat-square)](https://david-dm.org/studiometa/prettier-formatter-gitlab)
[![devDependency Status](https://img.shields.io/david/dev/studiometa/prettier-formatter-gitlab.svg?label=devDeps&style=flat-square)](https://david-dm.org/studiometa/prettier-formatter-gitlab?type=dev)

> Send Prettier errors to Gitlab's Code Quality reports.

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
eslint:
  image: node:14
  script:
    - npm ci
    - prettier-formatter-gitlab 'prettier -l src/'
  artifacts:
    reports:
      codequality: gl-codequality.json
```

## Notes

This project is heavily inspired and borrows some function to the [`eslint-formatter-gitlab`](https://gitlab.com/remcohaszing/eslint-formatter-gitlab) package.
