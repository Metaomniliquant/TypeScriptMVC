/// <reference path="Core/Core.ts" />
/// <reference path="View/DataDictionary.ts" />

module MVC {
    "use strict";

    export interface IController {
        ViewData: ViewDataDictionary;
        ApplicationIdentifier: string;
    }

    export class ControllerBase extends CoreObject implements IController {
        private viewData: ViewDataDictionary;
        private applicationIdentifier: string;

        public constructor(controllerName: string, applicationIdentifier: string) {
            super();

            Args.IsNotNull(controllerName, "controllerName");
            Args.IsNotNull(applicationIdentifier, "applicationIdentifier");

            this.applicationIdentifier = applicationIdentifier;

            Application.Instance(applicationIdentifier).RegisterController(this, controllerName);

            this.viewData = new ViewDataDictionary();
        }

        public get ViewData(): ViewDataDictionary {
            return this.viewData;
        }

        public get ApplicationIdentifier(): string {
            return this.applicationIdentifier;
        }
    }

    export class Controller extends ControllerBase {
        public constructor(controllerName: string, applicationIdentifier: string) {
            super(controllerName, applicationIdentifier);
        }

        public View(viewModel: IViewModel): IActionResult {
            return new ViewResult(viewModel.View, this.ViewData);
        }
    }
}