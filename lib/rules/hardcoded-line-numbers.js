/**
 * @fileoverview Ensure hardcoded line numbers (in the form "filename.js:nn") are up to date.
 * @author William Hilton
 */
"use strict";
const path = require('path')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Ensure hardcoded line numbers in strings (in the form \"filename.js:nn\") are up to date.",
            category: "Possible Errors",
            recommended: false,
            url: "https://github.com/wmhilton/awesome-errors"
        },
        fixable: "code",
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            Literal: node => {
                const correctThing = `${path.basename(context.getFilename())}:${node.loc.start.line}`
                const closeThing = new RegExp(`\\b${path.basename(context.getFilename())}:(\\d+)`, 'g')
                const correctValue = node.raw.replace(closeThing, correctThing)
                if (node.raw !== correctValue) {
                    context.report({
                        node,
                        message: 'String containing filename:linenumber has wrong line number',
                        fix: fixer => {
                            return fixer.replaceText(node, correctValue)
                        }
                    })
                }
            },
            TemplateLiteral: node => {
                for (const quasi of node.quasis) {
                    const correctThing = `${path.basename(context.getFilename())}:${quasi.loc.start.line}`
                    const closeThing = new RegExp(`\\b${path.basename(context.getFilename())}:(\\d+)`, 'g')
                    const correctValue = quasi.value.raw.replace(closeThing, correctThing)
                    if (quasi.value.raw !== correctValue) {
                        context.report({
                            node,
                            message: 'Template string containing filename:linenumber has wrong line number',
                            fix: fixer => {
                                return fixer.replaceTextRange(
                                    [quasi.range[0] + 1, quasi.range[0] + 1 + quasi.value.raw.length],
                                    correctValue
                                )
                            }
                        })
                    }
                }
            }
        };
    }
};
