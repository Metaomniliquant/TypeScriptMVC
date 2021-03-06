﻿/* tslint:disable:comment-format */
/* tslint:disable:jsdoc-format */
// domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)

module MVC {
    "use strict";

    export class StackTrace {
        public constructor(private guess: boolean = true, private ex: Error = null, private browserMode: string = null) {
        }

        public get Trace(): Array<string> {
            var results: Array<string> = this._run(this.ex, this.browserMode);

            if (this.guess) {
                return this.guessAnonymousFunctions(results);
            } else {
                return results;
            }
        }

        private _run(ex: Error, mode: string): Array<string> {
            var exception: Error = ex || this.createException();
            var exMode: string = mode || this.mode(exception);
            if (exMode === "other") {
                /* tslint:disable:no-arg */
                return this.other(arguments.callee);
                /* tslint:enable:no-arg */
            } else {
                return this[exMode](exception);
            }
        }

        createException(): Error {
            try {
                var x: number = 1 / 0;
                return new Error(x.toString());
            } catch (e) {
                return e;
            }
        }

        /**
         * Mode could differ for different exception, e.g.
         * exceptions in Chrome may or may not have arguments or stack.
         *
         * @return {String} mode of operation for the exception
         */
        mode(e: any): string {
            /* tslint:disable:no-string-literal */
            if (e["arguments"] && e.stack) {
                /* tslint:enable:no-string-literal */
                return "chrome";
            }

            if (e.stack && e.sourceURL) {
                return "safari";
            }

            if (e.stack && e.number) {
                return "ie";
            }

            if (e.stack && e.fileName) {
                return "firefox";
            }

            if (e.message && e["opera#sourceloc"]) {
                // e.message.indexOf("Backtrace:") > -1 -> opera9
                // "opera#sourceloc" in e -> opera9, opera10a
                // !e.stacktrace -> opera9
                if (!e.stacktrace) {
                    return "opera9"; // use e.message
                }
                if (e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length) {
                    // e.message may have more stack entries than e.stacktrace
                    return "opera9"; // use e.message
                }
                return "opera10a"; // use e.stacktrace
            }

            if (e.message && e.stack && e.stacktrace) {
                // e.stacktrace && e.stack -> opera10b
                if (e.stacktrace.indexOf("called from line") < 0) {
                    return "opera10b"; // use e.stacktrace, format differs from "opera10a"
                }
                // e.stacktrace && e.stack -> opera11
                return "opera11"; // use e.stacktrace, format differs from "opera10a", "opera10b"
            }

            if (e.stack && !e.fileName) {
                // Chrome 27 does not have e.arguments as earlier versions,
                // but still does not have e.fileName as Firefox
                return "chrome";
            }

            return "other";
        }

        /**
     * Given a context, function name, and callback function, overwrite it so that it calls
     * printStackTrace() first with a callback and then runs the rest of the body.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to instrument
     * @param {Function} callback function to call with a stack trace on invocation
     */
        instrumentFunction(context: Object, functionName: string, callback: (s: Array<string>) => void): void {
            context = context || window;
            var original: (...argArray: any[]) => any = context[functionName];
            context[functionName] = function instrumented(): any {
                var stackTrace: StackTrace = new StackTrace();
                var results: Array<string> = stackTrace.Trace;
                callback.call(this, results.slice(4));
                return context[functionName]._instrumented.apply(this, arguments);
            };
            context[functionName]._instrumented = original;
        }

        /**
         * Given a context and function name of a function that has been
         * instrumented, revert the function to it"s original (non-instrumented)
         * state.
         *
         * @param {Object} context of execution (e.g. window)
         * @param {String} functionName to de-instrument
         */
        deinstrumentFunction(context: Object, functionName: string): void {
            if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context[functionName]._instrumented.constructor === Function) {
                context[functionName] = context[functionName]._instrumented;
            }
        }

        /**
     * Given an Error object, return a formatted Array based on Chrome"s stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
        chrome(e: any): Array<string> {
            return (e.stack + "\n")
                .replace(/^[\s\S]+?\s+at\s+/, " at ") // remove message
                .replace(/^\s+(at eval )?at\s+/gm, "") // remove "at" and indentation
                .replace(/^([^\(]+?)([\n$])/gm, "{anonymous}() ($1)$2")
                .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}() ($1)")
                .replace(/^(.+) \((.+)\)$/gm, "$1@$2")
                .split("\n")
                .slice(0, -1);
        }

        /**
         * Given an Error object, return a formatted Array based on Safari"s stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        safari(e: any): Array<string> {
            return e.stack.replace(/\[native code\]\n/m, "")
                .replace(/^(?=\w+Error\:).*$\n/m, "")
                .replace(/^@/gm, "{anonymous}()@")
                .split("\n");
        }

        /**
         * Given an Error object, return a formatted Array based on IE"s stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        ie(e: any): Array<string> {
            return e.stack
                .replace(/^\s*at\s+(.*)$/gm, "$1")
                .replace(/^Anonymous function\s+/gm, "{anonymous}() ")
                .replace(/^(.+)\s+\((.+)\)$/gm, "$1@$2")
                .split("\n")
                .slice(1);
        }

        /**
         * Given an Error object, return a formatted Array based on Firefox"s stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        firefox(e: any): Array<string> {
            return e.stack.replace(/(?:\n@:0)?\s+$/m, "")
                .replace(/^(?:\((\S*)\))?@/gm, "{anonymous}($1)@")
                .split("\n");
        }

        opera11(e: any): Array<string> {
            var ANON: string = "{anonymous}", lineRE: RegExp = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
            var lines: Array<string> = e.stacktrace.split("\n"), result: Array<string> = [];

            for (var i: number = 0, len: number = lines.length; i < len; i += 2) {
                var match: RegExpExecArray = lineRE.exec(lines[i]);
                if (match) {
                    var location: string = match[4] + ":" + match[1] + ":" + match[2];
                    var fnName: string = match[3] || "global code";
                    fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                    result.push(fnName + "@" + location + " -- " + lines[i + 1].replace(/^\s+/, ""));
                }
            }

            return result;
        }

        opera10b(e: any): Array<string> {
            // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
            // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
            // "@file://localhost/G:/js/test/functional/testcase1.html:15"
            var lineRE: RegExp = /^(.*)@(.+):(\d+)$/;
            var lines: Array<string> = e.stacktrace.split("\n"), result: Array<string> = [];

            for (var i: number = 0, len: number = lines.length; i < len; i++) {
                var match: RegExpExecArray = lineRE.exec(lines[i]);
                if (match) {
                    var fnName: string = match[1] ? (match[1] + "()") : "global code";
                    result.push(fnName + "@" + match[2] + ":" + match[3]);
                }
            }

            return result;
        }

        /**
         * Given an Error object, return a formatted Array based on Opera 10"s stacktrace string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        opera10a(e: any): Array<string> {
            // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
            // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
            var ANON: string = "{anonymous}", lineRE: RegExp = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines: Array<string> = e.stacktrace.split("\n"), result: Array<string> = [];

            for (var i: number = 0, len: number = lines.length; i < len; i += 2) {
                var match: RegExpExecArray = lineRE.exec(lines[i]);
                if (match) {
                    var fnName: string = match[3] || ANON;
                    result.push(fnName + "()@" + match[2] + ":" + match[1] + " -- " + lines[i + 1].replace(/^\s+/, ""));
                }
            }

            return result;
        }

        // Opera 7.x-9.2x only!
        opera9(e: any): Array<string> {
            // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
            // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
            var ANON: string = "{anonymous}", lineRE: RegExp = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines: Array<string> = e.message.split("\n"), result: Array<string> = [];

            for (var i: number = 2, len: number = lines.length; i < len; i += 2) {
                var match: RegExpExecArray = lineRE.exec(lines[i]);
                if (match) {
                    result.push(ANON + "()@" + match[2] + ":" + match[1] + " -- " + lines[i + 1].replace(/^\s+/, ""));
                }
            }

            return result;
        }

        // Safari 5-, IE 9-, and others
        other(curr: any): Array<string> {
            var ANON: string = "{anonymous}",
                fnRE: RegExp = /function(?:\s+([\w$]+))?\s*\(/,
                stack: Array<string> = [],
                fn: string,
                args: Array<any>,
                maxStackSize: number = 10;
            var slice: any = Array.prototype.slice;
            while (curr && stack.length < maxStackSize) {
                fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
                try {
                    /* tslint:disable:no-string-literal */
                    args = slice.call(curr["arguments"] || []);
                    /* tslint:enable:no-string-literal */
                } catch (e) {
                    args = ["Cannot access arguments: " + e];
                }
                stack[stack.length] = fn + "(" + this.stringifyArguments(args) + ")";
                try {
                    curr = curr.caller;
                } catch (e) {
                    stack[stack.length] = "Cannot access caller: " + e;
                    break;
                }
            }
            return stack;
        }

        /**
     * Given arguments array as a String, substituting type names for non-string types.
     *
     * @param {Arguments,Array} args
     * @return {String} stringified arguments
     */
        stringifyArguments(args: Array<any>): string {
            var result: Array<string> = [];
            var slice: any = Array.prototype.slice;
            for (var i: number = 0; i < args.length; ++i) {
                var arg: any = args[i];
                if (arg === undefined) {
                    result[i] = "undefined";
                } else if (arg === null) {
                    result[i] = "null";
                } else if (arg.constructor) {
                    // TODO constructor comparison does not work for iframes
                    if (arg.constructor === Array) {
                        if (arg.length < 3) {
                            result[i] = "[" + this.stringifyArguments(arg) + "]";
                        } else {
                            result[i] = "["
                            + this.stringifyArguments(slice.call(arg, 0, 1))
                            + "..." + this.stringifyArguments(slice.call(arg, -1))
                            + "]";
                        }
                    } else if (arg.constructor === Object) {
                        result[i] = "#object";
                    } else if (arg.constructor === Function) {
                        result[i] = "#function";
                    } else if (arg.constructor === String) {
                        result[i] = "'" + arg + "'";
                    } else if (arg.constructor === Number) {
                        result[i] = arg;
                    } else {
                        result[i] = "?";
                    }
                }
            }
            return result.join(",");
        }

        private sourceCache: any = {};

        /**
     * @return {String} the text from a given URL
     */
        ajax(url: string): string {
            var req: any = this.createXMLHTTPObject();
            if (req) {
                try {
                    req.open("GET", url, false);
                    //req.overrideMimeType("text/plain");
                    //req.overrideMimeType("text/javascript");
                    req.send(null);
                    //return req.status == 200 ? req.responseText : "";
                    return req.responseText;
                } catch (e) {
                    return e.toString();
                }
            }
            return "";
        }

        /**
         * Try XHR methods in order and store XHR factory.
         *
         * @return {XMLHttpRequest} XHR function or equivalent
         */
        createXMLHTTPObject(): any {
            var xmlhttp: any, XMLHttpFactories: Array<() => any> = [
                function (): any {
                    return new XMLHttpRequest();
                }, function (): any {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                }, function (): any {
                    return new ActiveXObject("Msxml3.XMLHTTP");
                }, function (): any {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
            ];
            for (var i: number = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xmlhttp = XMLHttpFactories[i]();
                    // Use memoization to cache the factory
                    this.createXMLHTTPObject = XMLHttpFactories[i];
                    return xmlhttp;
                } catch (e) {
                    return null;
                }
            }
        }

        /**
         * Given a URL, check if it is in the same domain (so we can get the source
         * via Ajax).
         *
         * @param url {String} source url
         * @return {Boolean} False if we need a cross-domain request
         */
        isSameDomain(url: string): boolean {
            // location may not be defined, e.g. when running from nodejs.
            return typeof location !== "undefined"
                && url.indexOf(location.hostname) !== -1;
        }

        /**
         * Get source code from given URL if in the same domain.
         *
         * @param url {String} JS source URL
         * @return {Array} Array of source code lines
         */
        getSource(url: string): Array<string> {
            // TODO reuse source from script tags?
            if (!(url in this.sourceCache)) {
                this.sourceCache[url] = this.ajax(url).split("\n");
            }
            return this.sourceCache[url];
        }

        guessAnonymousFunctions(stack: Array<string>): Array<string> {
            for (var i: number = 0; i < stack.length; ++i) {
                var reStack: RegExp = /\{anonymous\}\(.*\)@(.*)/,
                    reRef: RegExp = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
                    frame: string = stack[i], ref: RegExpExecArray = reStack.exec(frame);

                if (ref) {
                    var m: RegExpExecArray = reRef.exec(ref[1]);
                    if (m) { // If falsey, we did not get any file/line information
                        var file: string = m[1], lineno: any = m[2], charno: any = m[3] || 0;
                        if (file && this.isSameDomain(file) && lineno) {
                            var functionName: string = this.guessAnonymousFunction(file, lineno, charno);
                            stack[i] = frame.replace("{anonymous}", functionName);
                        }
                    }
                }
            }
            return stack;
        }

        guessAnonymousFunction(url: string, lineNo: number, charNo: number): string {
            var ret: string;
            try {
                ret = this.findFunctionName(this.getSource(url), lineNo);
            } catch (e) {
                ret = "getSource failed with url: " + url + ", exception: " + e.toString();
            }
            return ret;
        }

        findFunctionName(source: Array<string>, lineNo: number): string {
            // FIXME findFunctionName fails for compressed source
            // (more than one function on the same line)
            // function {name}({args}) m[1]=name m[2]=args
            var reFunctionDeclaration: RegExp = /function\s+([^(]*?)\s*\(([^)]*)\)/;
            // {name} = function ({args}) TODO args capture
            // /[""]?([0-9A-Za-z_]+)[""]?\s*[:=]\s*function(?:[^(]*)/
            var reFunctionExpression: RegExp = /[""]?([$_A-Za-z][$_A-Za-z0-9]*)[""]?\s*[:=]\s*function\b/;
            // {name} = eval()
            var reFunctionEvaluation: RegExp = /[""]?([$_A-Za-z][$_A-Za-z0-9]*)[""]?\s*[:=]\s*(?:eval|new Function)\b/;
            // Walk backwards in the source lines until we find
            // the line which matches one of the patterns above
            var code: string = "",
                line: string,
                maxLines: number = Math.min(lineNo, 20),
                m: RegExpExecArray,
                commentPos: number;
            for (var i: number = 0; i < maxLines; ++i) {
                // lineNo is 1-based, source[] is 0-based
                line = source[lineNo - i - 1];
                commentPos = line.indexOf("//");
                if (commentPos >= 0) {
                    line = line.substr(0, commentPos);
                }
                // TODO check other types of comments? Commented code may lead to false positive
                if (line) {
                    code = line + code;
                    m = reFunctionExpression.exec(code);
                    if (m && m[1]) {
                        return m[1];
                    }
                    m = reFunctionDeclaration.exec(code);
                    if (m && m[1]) {
                        //return m[1] + "(" + (m[2] || "") + ")";
                        return m[1];
                    }
                    m = reFunctionEvaluation.exec(code);
                    if (m && m[1]) {
                        return m[1];
                    }
                }
            }
            return "(?)";
        }

    }
}