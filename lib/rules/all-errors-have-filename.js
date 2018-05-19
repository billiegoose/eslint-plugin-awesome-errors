/**
 * @fileoverview Errors should contain the filename and line number.
 * @author William Hilton
 */
"use strict";
const path = require('path')
let errorMap = require('../parse-errors-yaml').load('errors.yaml')
let errorList = Object.keys(errorMap)

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Errors should contain the filename and line number.",
            category: "Fill me in",
            recommended: false
        },
        fixable: "code",  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here
        var insideAnError = false
        var hasFilename = false

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isString = raw => /^['"`].*['"`]$/.test(raw)
        const isAnError = ({ callee }) => callee.type === 'Identifier' && callee.name === 'Error'
        const reset = () => {
            insideAnError = false
            hasFilename = false
        }
        const checkFilename = raw => (new RegExp(`\\b${path.basename(context.getFilename())}:(\\d+)`)).test(raw)
        const onEnterError = node => {
            if (!isAnError(node)) return
            insideAnError = true;
        }
        const onExitError = node => {
            if (!isAnError(node)) return
            if (!hasFilename) {
                context.report({
                    node,
                    message: 'Errors should contain the current filename and line number.',
                    fix: fixer => {
                        const insert = `${path.basename(context.getFilename())}:${node.loc.start.line}`
                        const target = node.arguments[0]
                        if (isString(target.raw)) {
                            return fixer.replaceText(target, `${target.raw[0]}${insert} ${target.raw.slice(1)}`)
                        }
                        if (target.type === 'TemplateLiteral') {
                            const quasi = target.quasis[0]
                            return fixer.replaceTextRange(
                                [quasi.range[0] + 1, quasi.range[0] + 1 + quasi.value.raw.length],
                                `${insert} ${quasi.value.raw}`)
                        }
                        if (target) {
                            return fixer.insertTextBefore(target, `'${path.basename(context.getFilename())}:${node.loc.start.line} ' + `)
                        }
                    }
                })
            }
            reset()
        }
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            NewExpression: onEnterError,
            CallExpression: onEnterError,
            "NewExpression:exit": onExitError,
            "CallExpression:exit": onExitError,
            Literal: node => {
                if (!insideAnError) return
                if (!isString(node.raw)) return
                if (checkFilename(node.raw)) {
                    hasFilename = true
                }
            },
            TemplateLiteral: node => {
                if (!insideAnError) return
                for (const quasi of node.quasis) {
                    if (checkFilename(quasi.value.raw)) {
                        hasFilename = true
                    }
                }
            },
        };
    }
};
