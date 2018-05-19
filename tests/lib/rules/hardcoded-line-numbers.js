/**
 * @fileoverview Ensure hardcoded line numbers (in the form &#34;filename.js:nn&#34;) are up to date.
 * @author William Hilton
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/hardcoded-line-numbers"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("hardcoded-line-numbers", rule, {

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
    ],

    invalid: [
        {
            code: "Error(`myfile.js:2 E100: Some error`)",
            filename: "/some/dir/myfile.js",
            errors: [{ message: 'Template string containing filename:linenumber has wrong line number' }],
            output: "Error(`myfile.js:1 E100: Some error`)",
        },
        {
            code: "Error('myfile.js:22 Some error')",
            filename: 'myfile.js',
            errors: [{ message: 'String containing filename:linenumber has wrong line number' }],
            output: "Error('myfile.js:1 Some error')",
        },
        {
            code: "Error('E99 myfile.js:11')",
            filename: 'myfile.js',
            errors: [{ message: 'String containing filename:linenumber has wrong line number' }],
            output: "Error('E99 myfile.js:1')",
        },
        {
            code: "console.log(\"myfile.js:2\")",
            filename: "/some/dir/myfile.js",
            errors: [{ message: 'String containing filename:linenumber has wrong line number' }],
            output: "console.log(\"myfile.js:1\")",
        }
    ]
});
