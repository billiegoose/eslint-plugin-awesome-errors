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

Add `awesome-errors` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "awesome-errors"
    ]
}
```

Then create an `errors.yaml` file in your project's root directory (or wherever you run eslint).

Now, run:

```
eslint \
  --rule 'awesome-errors/all-errors-have-code: error' \
  --rule 'awesome-errors/all-errors-have-filename: error' \
  --rule 'awesome-errors/hardcoded-line-numbers: error' \
  --config .eslintrc.base.yaml \
  --no-eslintrc \
  --plugin awesome-errors \
  --fix
  .
```

## Supported Rules

* hardcoded-line-numbers: Ensure hardcoded line numbers in strings (in the form "filename.js:nn") are up to date.
* all-errors-have-code: Make sure all errors include an error code defined in errors.yaml.
* all-errors-have-filename: Make sure all errors include an the filename and line number.

