/// <reference path="StackTrace.ts" />

module MVC {
    "use strict";

    export var undefined: any;

    export interface IUnknown extends Object {
        typeOf: () => string;
        getHashCode: () => number;
        equals: (b: Object) => boolean;
        toString: () => string;
    }

    export class CoreObject implements IUnknown {
        public typeOf(): string {
            return typeof this;
        }
        public toString(): string {
            var props: Array<string> = Object.getOwnPropertyNames(this);

            var values: Array<{ name: string; value: any }> = new Array<{ name: string; value: any }>();

            var i: number = 0;

            for (i; i < props.length; i++) {
                values.push({ name: props[i], value: this[props[i]] });
            }

            var strValues: string = JSON.stringify(values);

            return strValues === "[]" ? "" : strValues;
        }
        public getHashCode(): number {
            var str: string = this.toString(),
                hash: number = 0;
            if (str.length === 0) {
                return hash;
            }
            for (var i: number = 0; i < str.length; i++) {
                var char: number = str.charCodeAt(i);
                /* tslint:disable:no-bitwise */
                hash = ((hash >> 5) + hash) + char;
                /* tslint:enable:no-bitwise */
            }
            return hash;
        }
        public equals(b: Object): boolean {
            var t: string,
                result: boolean = false;

            if (b === this) {
                return true;
            }

            /* tslint:disable:forin */
            for (t in this) {
                if (typeof b[t] === undefined || (b[t] !== this[t])) {
                    result = false;
                    break;
                }

                result = b[t] === this[t];

                if (!result) {
                    break;
                }
            }
            /* tslint:enable:forin */

            return result;
        }
    }

    export class Exception extends CoreObject {
        public constructor(private message: string = "An exception has occured", private innerException: Exception = null) {
            super();
        }

        public get Message(): string {
            return this.message;
        }

        public get InnerException(): Exception {
            return this.innerException;
        }

        public get StackTrace(): StackTrace {
            if (!Args.IsNull(console) && !Args.IsNull(console.trace)) {
                console.trace.call(console);
            }

            return new StackTrace();
        }
    }

    export class ApplicationException extends Exception {
    }

    export class TargetException extends ApplicationException {
        public constructor(message: string = "An attempt was made to invoke a target that was not valid.", innerException?: Exception) {
            super(message, innerException);
        }
    }

    export class TargetInvocationException extends ApplicationException {
        public constructor(message: string = "An exception was thrown by the target of an invocation.", innerException?: Exception) {
            super(message, innerException);
        }
    }

    export class CoreException extends Exception {
    }

    export class ArgumentException extends CoreException {
        _parameter: string;
        public constructor(parameter: string, message?: string, innerException?: Exception) {
            this._parameter = parameter;
            if (!Args.IsNull(this._parameter) && Args.IsNull(message)) {
                message = "An invalid argument was specified. Please check the {0} parameter.".replace("{0}", parameter);
            } else if (Args.IsNull(message)) {
                message = "An invalid argument was specified.";
            } else if (!Args.IsNull(this._parameter)) {
                message = message.replace("{0}", this._parameter);
            } else {
                message = message;
            }
            super(message, innerException);
        }
    }

    export class ArgumentNullException extends ArgumentException {
        public constructor(parameter: string,
            message: string = "The {0} argument cannot be null.",
            innerException?: Exception) {
            super(parameter, message, innerException);
        }
    }

    export class ArgumentOutOfRangeException extends ArgumentException {
        public constructor(parameter: string,
            message: string = "The {0} argument value is out of the allowed range.",
            innerException?: Exception) {
            super(parameter, message, innerException);
        }
    }

    export class NullReferenceException extends CoreException {
        public constructor(message: string = "An object reference was not set to an instance of an object.",
            innerException?: Exception) {
            super(message, innerException);
        }
    }

    export class InvalidOperationException extends CoreException {
        public constructor(message: string = "An attempt was made to operate on an object with an invalid state.",
            innerException?: Exception) {
            super(message, innerException);
        }
    }

    export module Args {
        export function IsNull(arg: any): boolean {
            return arg === undefined || arg === null;
        }
        export function IsNotNull(arg: any, argString: string, allowEmpty: boolean = true): void {
            if ((arg === null || arg === undefined) || (allowEmpty !== true && arg === "")) {
                throw new ArgumentNullException(argString);
            }
        }
    }
}