# eslint-plugin-awesome-errors

Makes your Errors awesome!

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-awesome-errors`:

```
$ npm install eslint-plugin-awesome-errors --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-awesome-errors` globally.

## Usage

Create an `errors.yaml` file in your project's root directory (or wherever you run eslint).

Add `awesome-errors` to the plugins section of your `.eslintrc` configuration file like so:

```json
{
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "awesome-errors"
  ],
  "rules": {
    "awesome-errors/all-errors-have-code": "error",
    "awesome-errors/all-errors-have-filename": "error",
    "awesome-errors/hardcoded-line-numbers": "error"
  }
}

```

Now, run `eslint --fix ./src`. Boom! :boom: Your errors are awesome.
Neaten up `errors.yaml` as desired and integrate it into your documentation.

## Supported Rules

* all-errors-have-code: Make sure all errors include an error code defined in errors.yaml.
* all-errors-have-filename: Make sure all errors include an the filename and line number.
* hardcoded-line-numbers: Ensure hardcoded line numbers in strings (in the form "filename.js:nn") are up to date.
