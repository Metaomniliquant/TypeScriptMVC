/// <reference path="../../Application.ts" />

module Mock {
    "use strict";

    export class AppConfig extends MVC.AppConfigBase {
        public get DefaultAction(): string {
            return "Index";
        }
        public get AppNamespace(): Object {
            return Mock;
        }
        public get UniqueIdentifier(): string {
            return "MockApplication";
        }
    }

    export class MockApplication extends MVC.Application {
        public constructor() {
            super(new AppConfig());

            var elem: HTMLElement = document.getElementById("qunit-fixture");

            this.Root = new MVC.View(undefined, elem);
        }
    }
}
