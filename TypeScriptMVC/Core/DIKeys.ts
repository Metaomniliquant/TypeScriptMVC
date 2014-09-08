/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export class DIKeys extends CoreObject {
        public static AppId(app: string): string {
            return "MVC_" + app + "_ApplicationIdentifierDIKey";
        }

        public static ControllerName(app: string, controllerName: string): string {
            return "MVC_" + app + "_" + controllerName + "_ControllerNameDIKey";
        }

        public static Router(app: string): string {
            return "MVC_" + app + "_RouterDIKey";
        }

        public static RequestContext(app: string): string {
            return "MVC_" + app + "_RequestContextDIKey";
        }

        public static WindowContext(app: string): string {
            return "MVC_" + app + "_WindowContextDIKey";
        }

        public static DocumentContext(app?: string): string {
            return "MVC_" + app + "_DocumentContextDIKey";
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

        public static Controller(app: string, name: string): string {
            return "MVC_" + app + "_" + name + "_ControllerDIKey";
        }

        public static Application(app: string): string {
            return "MVC_" + app + "_ApplicationDIKey";
        }
    }
}