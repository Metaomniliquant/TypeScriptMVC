/// <reference path="../Core/Core.ts" />
/// <reference path="../Controller.ts" />

module MVC {
    "use strict";

    export interface IControllerRegistryItem {
        Controller: IController;
        Name: string;
        Actions: ICollection<string>;
    }

    export class ControllerRegistryItemBase extends CoreObject implements IControllerRegistryItem {
        public constructor(private controller?: IController, private name?: string, private actions?: ICollection<string>) {
            super();
        }

        public get Controller(): IController {
            return this.controller;
        }

        public set Controller(controller: IController) {
            this.controller = controller;
        }

        public get Name(): string {
            return this.name;
        }

        public set Name(name: string) {
            this.name = name;
        }

        public get Actions(): ICollection<string> {
            return this.actions;
        }

        public set Actions(actions: ICollection<string>) {
            this.actions = actions;
        }
    }

    export class ControllerRegistryItem extends ControllerRegistryItemBase {
    }

    export interface IControllerRegistry extends ICollection<IControllerRegistryItem> {
        FindByName: (name: string) => IControllerRegistryItem;
        GetRegistryItem: (controller: IController, name: string) => IControllerRegistryItem;
    }

    export class ControllerRegistry extends Collection<IControllerRegistryItem> implements IControllerRegistry {
        public constructor() {
            super();
        }

        public FindByName(name: string): IControllerRegistryItem {
            var i: number = 0,
                registryItem: IControllerRegistryItem = null,
                fullName: string = name + "Controller";

            for (i; i < this.Count; i++) {
                var item: IControllerRegistryItem = this.Get(i);

                if (item.Name === fullName) {
                    registryItem = item;
                    break;
                }
            }

            return registryItem;
        }

        public GetRegistryItem(controller: IController, name: string): IControllerRegistryItem {
            var i: number = 0,
                registryItem: IControllerRegistryItem = null;

            for (i; i < this.Count; i++) {
                var item: IControllerRegistryItem = this.Get(i);

                if (item.Controller === controller && item.Name === name) {
                    registryItem = item;
                    break;
                }
            }

            return registryItem;
        }
    }
}