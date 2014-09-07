/// <reference path="../Core/Core.ts" />
/// <reference path="../Controller.ts" />

module MVC {
    "use strict";

    export interface IControllerLocator {
        Process(appId: string): ICollection<IController>;
    }

    export class ControllerLocatorBase extends CoreObject implements IControllerLocator {
        public constructor(private root: Object) {
            super();
        }

        public Process(appId: string): ICollection<IController> {
            var controllers: ICollection<IController> = new Collection<IController>(),
                c: string = null,
                nameKey: string = "",
                tmp: IController = null;
            if (!Args.IsNull(this.root)) {
                for (c in this.root) {
                    if (c.lastIndexOf("Controller") > 0) {
                        nameKey = DIKeys.ControllerName(appId, c);
                        DependencyResolver.Current.RegisterInstance(nameKey, c);

                        this.RegisterController(appId, this.root[c]);

                        // add dep call
                        tmp = this.GetController(appId, c);

                        controllers.Add(tmp);
                    }
                }
            }

            return controllers;
        }

        private GetFullControllerName(controller: IController): string {
            if (!Args.IsNull(controller) && !Args.IsNull(controller.toString)) {
                var arr: Array<string> = controller.toString().match(
                    /function\s*(\w+)/);

                if (!Args.IsNull(arr) && arr.length === 2) {
                    return arr[1];
                }
            }

            return "undefined";
        }

        private RegisterController(appId: string, controller: IController): void {
            // add controller to IoC container
            var FN_ARGS: RegExp = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                i: number = 0,
                depKeys: Array<string> = null,
                name: string = "",
                key: string = "",
                nameKey: string = "",
                appIdKey: string = "",
                args: Array<any> = null;

            depKeys = controller.toString().match(FN_ARGS)[1].split(",");
            name = this.GetFullControllerName(controller);
            key = DIKeys.Controller(appId, name);
            nameKey = DIKeys.ControllerName(appId, name);
            appIdKey = DIKeys.AppId(appId);
            args = new Array<any>();

            args.push(key);
            args.push(controller);

            args.push(nameKey);
            args.push(appIdKey);
            for (; i < depKeys.length; i++) {
                args.push(depKeys[i]);
            }

            DependencyResolver.Current.RegisterType.apply(DependencyResolver.Current, args);
        }

        private GetController(appId: string, name: string): IController {
            var key: string = DIKeys.Controller(appId, name);
            var tmp: IController = DependencyResolver.Current.GetService<IController>(key);

            return tmp;
        }
    }

    export class ControllerLocator extends ControllerLocatorBase {
    }
}