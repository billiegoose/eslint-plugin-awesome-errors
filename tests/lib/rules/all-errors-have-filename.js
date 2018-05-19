/**
 * @fileoverview Errors should contain the filename and line number.
 * @author William Hilton
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/all-errors-have-filename"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("all-errors-have-filename", rule, {

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
            code: "Error('myfile.js:22 Some error')",
            filename: 'myfile.js',
        },
        {
            code: "Error('E99 myfile.js:11')",
            filename: 'myfile.js',
        },
    ],

    invalid: [
        {
            code: "new Error('ordinary error')",
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ]
        },
        {
            code: "new Error(foo)",
            filename: "/some/dir/myfile.js",
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ]
        },
        {
            code: "Error(400)",
            filename: "/some/dir/myfile.js",
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ]
        },
        {
            code: "new Error('Some error')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ]
        },
        {
            code: "Error('Some error')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ]
        },
        {
            code: "Error('E101 Some error')",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ],
            output: "Error('myfile.js:1 E101 Some error')",
        },
        {
            code: "Error(`E101 Some error`)",
            filename: 'myfile.js',
            errors: [
                { message: 'Errors should contain the current filename and line number.' }
            ],
            output: "Error(`myfile.js:1 E101 Some error`)",
        },
    ]
});
