/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export interface IParser<TInput, TOutput> extends IUnknown {
        Parse(parsee: TInput): IParsedObject<TInput, TOutput>;
    }

    export interface IParsedObject<TInput, TOutput> extends IUnknown {
        Original: TInput;
        Value: TOutput;
    }

    export class ParsedObject<TInput, TOutput> extends CoreObject implements IParsedObject<TInput, TOutput> {
        public constructor(private input: TInput, private output: TOutput) {
            super();
        }

        public get Original(): TInput {
            return this.input;
        }

        public get Value(): TOutput {
            return this.output;
        }
    }
}