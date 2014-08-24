module MVC {
    "use strict";

    export interface IAppConfig {
        DefaultAction: string;
        UniqueIdentifier: string;
        AppNamespace: Object;
        RootPath: string;
    }

    export class AppConfigBase extends CoreObject implements IAppConfig {
        private uniqueIdentifier: string;
        public constructor() {
            super();

            this.uniqueIdentifier = Date.now().toString();
        }

        public get DefaultAction(): string {
            return "Index";
        }

        public get UniqueIdentifier(): string {
            return this.uniqueIdentifier;
        }

        public get AppNamespace(): Object {
            return {};
        }

        public get RootPath(): string {
            return "/";
        }
    }
} 