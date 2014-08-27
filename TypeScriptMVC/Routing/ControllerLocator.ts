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
                c: string = null;
            if (!Args.IsNull(this.root)) {
                for (c in this.root) {
                    if (c.lastIndexOf("Controller") > 0) {
                        var tmp: IController = new this.root[c](c, appId);

                        controllers.Add(tmp);
                    }
                }
            }

            return controllers;
        }
    }

    export class ControllerLocator extends ControllerLocatorBase {
    }
}