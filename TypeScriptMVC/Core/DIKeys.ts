/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export class DIKeys extends CoreObject {
        public static Router(app: string): string {
            return "MVC_" + app + "_RouterDIKey";
        }

        public static RequestContext(app: string): string {
            return "MVC_" + app + "_RequestContextDIKey";
        }

        public static ControllerLocator(app: string): string {
            return "MVC_" + app + "_IControllerLocatorDIKey";
        }

        public static HashWatcher(app: string): string {
            return "MVC_" + app + "_HashWatcherDIKey";
        }

        public static ModelBinder(): string {
            return "MVC_IModelBinderDIKey";
        }

        public static Application(app: string): string {
            return "MVC_" + app + "_ApplicationDIKey";
        }
    }
}