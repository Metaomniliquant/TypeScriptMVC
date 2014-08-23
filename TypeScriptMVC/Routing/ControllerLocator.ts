/// <reference path="../Core/Core.ts" />
/// <reference path="../Controller.ts" />

module MVC {
    "use strict";

    export interface IControllerLocator {
        Process(): ICollection<IController>;
    }

    export class ControllerLocatorBase extends CoreObject implements IControllerLocator {
        public constructor(private root: Object) {
            super();
        }

        public Process(): ICollection<IController> {
            var controllers: ICollection<IController> = new Collection<IController>(),
                c: string = null;
            if (!Args.IsNull(this.root)) {
                for (c in this.root) {
                    if (c.lastIndexOf("Controller") > 0) {
                        controllers.Add(new this.root[c]());
                    }
                }
            }

            return controllers;
        }
    }

    export class ControllerLocator extends ControllerLocatorBase {
    }
}