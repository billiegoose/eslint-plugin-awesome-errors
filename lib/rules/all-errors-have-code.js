/**
 * @fileoverview Make sure all errors include an error code
 * @author William Hilton
 */
"use strict";
const path = require('path')
let errorYAML = require('../parse-errors-yaml')
let errorMap = errorYAML.load('errors.yaml')
let errorList = Object.keys(errorMap)
let rawCodeNumbers = errorList.map(x => Number(x.replace(/\D/g, '')))
let currentHighestCode = 0
for (let code of rawCodeNumbers) if (code > currentHighestCode) currentHighestCode = code

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Make sure all errors include an error code defined in errors.yaml.",
            category: "Possible Errors",
            recommended: false,
            url: "https://github.com/wmhilton/awesome-errors"
        },
        fixable: "code",  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here
        var insideAnError = false
        var hasCode = false

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isString = raw => /^['"`].*['"`]$/.test(raw)
        const isAnError = ({ callee }) => callee.type === 'Identifier' && callee.name === 'Error'
        const reset = () => {
            insideAnError = false
            hasCode = false
        }
        const checkCode = raw => {
            for (const error of errorList) {
                if (raw.indexOf(error) > -1) return true
            }
            return false
        }
        const onEnterError = node => {
            if (!isAnError(node)) return
            insideAnError = true;
        }
        const onExitError = node => {
            if (!isAnError(node)) return
            if (!hasCode) {
                context.report({
                    node,
                    message: 'Errors should contain an error code found in errors.yaml.',
                    fix: fixer => {
                        // Generate a new error code
                        const code = 'E' + ++currentHighestCode
                        const target = node.arguments[0]
                        if (!target) return
                        if (node.arguments.length === 1 && isString(target.raw)) {
                            const message = target.raw.replace(/^['"]/, '').replace(/['"]$/, '')
                            // Grab the error message
                            errorMap[code] = message
                            errorList.push(code)
                            // Add the pair to the YAML
                            errorYAML.append('errors.yaml', code, message)
                            // insert the error code into the error
                            return fixer.replaceText(target, `${target.raw[0]}${code} ${target.raw.slice(1)}`)
                        }
                        if (target.type === 'TemplateLiteral') {
                            const quasi = target.quasis[0]
                            const message = context.getSourceCode().getText(target)
                                .replace(/^`/, '').replace(/`$/, '')
                            // const message = target.quasis.map((x, i) => x.value.raw + '{' + target.).join('${}')
                            // Grab the error message
                            errorMap[code] = message
                            errorList.push(code)
                            // Add the pair to the YAML
                            errorYAML.append('errors.yaml', code, message)
                            // insert the error code into the error
                            return fixer.replaceTextRange(
                                [quasi.range[0] + 1, quasi.range[0] + 1 + quasi.value.raw.length],
                                `${code} ${quasi.value.raw}`)
                        }
                        // Grab the error message
                        const message = context.getSourceCode().getText(target)
                        errorMap[code] = message
                        errorList.push(code)
                        // Add the pair to the YAML
                        errorYAML.append('errors.yaml', code, message)
                        // insert the error code into the error
                        return fixer.insertTextBefore(target, `'${code} ' + `)
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
                if (checkCode(node.raw)) {
                    hasCode = true
                }
            },
            TemplateLiteral: node => {
                if (!insideAnError) return
                for (const quasi of node.quasis) {
                    if (checkCode(quasi.value.raw)) {
                        hasCode = true
                    }
                }
            },
        };
    }
};
