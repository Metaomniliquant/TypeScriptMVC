/// <reference path="../Core/Context.ts" />

module MVC {
    "use strict";

    export interface IDocumentContext extends IContext {
        Document: Document;
    }

    export class DocumentContextBase extends ContextBase implements IDocumentContext {
        public constructor(loc?: Location, nav?: Navigator, private doc?: Document) {
            super(loc, nav);

            if (Args.IsNull(this.doc)) {
                this.doc = DefaultDocument.Get();
            }
        }
        public get Document(): Document {
            return this.doc;
        }
    }

    export class DocumentContext extends DocumentContextBase {
    }
}