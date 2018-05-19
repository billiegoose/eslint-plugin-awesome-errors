/**
 * @fileoverview Make sure all errors include an error code
 * @author William Hilton
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/all-errors-have-code"),

    RuleTester = require("eslint").RuleTester;


RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 2018,
    }
});
      
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("all-errors-have-code", rule, {

    valid: [
        {
            code: "new Error('myfile.js:1 E100: Some error')",
            filename: "/some/dir/myfile.js"
        },
        {
            code: "Error(`myfile.js:1 E100: Some error`)",
            filename: "/some/dir/myfile.js"
        },
        {
            code: "(x) => new Error(`${'myfile.js:1' + ' ' + `E100${x}` + `: ${message}`}`)",
            filename: "/some/dir/myfile.js"
        },
        {
            code: "Error('E101 Some error')",
            filename: 'myfile.js',
        },
        {
            code: "Error(`E101 Some error`)",
            filename: 'myfile.js',
        },
    ],

    invalid: [
        {
            code: "new Error(foo)",
            filename: "/some/dir/myfile.js",
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' },
            ],
            output: "new Error('E1003 ' + foo)"
        },
        {
            code: "Error(400)",
            filename: "/some/dir/myfile.js",
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' },
            ],
            output: "Error('E1004 ' + 400)"
        },
        {
            code: "new Error('Some error')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' },
            ],
            output: "new Error('E1005 Some error')"
        },
        {
            code: "Error('Some error')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' },
            ],
            output: "Error('E1006 Some error')"
        },
        {
            code: "Error('myfile.js:22 Some error')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' }
            ],
            output: "Error('E1007 myfile.js:22 Some error')"
        },
        {
            code: "Error('E99 myfile.js:11')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' }
            ],
            output: "Error('E1008 E99 myfile.js:11')"
        },
        {
            code: "Error(`Some error: ${data}`)",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain an error code found in errors.yaml.' }
            ],
            output: "Error(`E1009 Some error: ${data}`)"
        },
    ]
});
