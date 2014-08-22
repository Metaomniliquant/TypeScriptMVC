/// <reference path="../../Application.ts" />

module Mock {
    "use strict";

    export class AppConfig implements MVC.IAppConfig {
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
            super("MockApplication", new AppConfig());

            var elem: HTMLElement = document.getElementById("qunit-fixture");

            this.Root = new MVC.View(undefined, elem);
        }
    }
}