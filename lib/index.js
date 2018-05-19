/**
 * @fileoverview Ensure hardcoded line numbers (in the form &#34;filename.js:nn&#34;) have the correct current line number.
 * @author William Hilton
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");



