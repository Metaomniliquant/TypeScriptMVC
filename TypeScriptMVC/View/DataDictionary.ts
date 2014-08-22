/// <reference path="../Core/Core.ts" />
/// <reference path="../Core/Dictionary.ts" />

module MVC {
    "use strict";

    export class BaseDataDictionary extends Dictionary<string, any> {
        public get DataItems(): Array<any> {
            return this.Values.Items;
        }
    }

    export class ViewDataDictionary extends BaseDataDictionary {
    }

    export class TempDataDictionary extends BaseDataDictionary {
    }
}