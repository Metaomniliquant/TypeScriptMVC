/// <reference path="Core/Core.ts" />
/// <reference path="View/DataDictionary.ts" />

module MVC {
    "use strict";

    export interface IController {
        ViewData: ViewDataDictionary;
        AppId: string;
        FullControllerName: string;
        Name: string;
    }

    export class ControllerBase extends CoreObject implements IController {
        private viewData: ViewDataDictionary;

        public constructor(private controllerName: string, private applicationIdentifier: string) {
            super();

            Args.IsNotNull(this.controllerName, "controllerName");
            Args.IsNotNull(this.applicationIdentifier, "applicationIdentifier");

            DependencyResolver.Current.GetService<IApplication>(
                DIKeys.Application(this.applicationIdentifier))
                    .RegisterController(this, controllerName);

            this.viewData = new ViewDataDictionary();
        }

        public get ViewData(): ViewDataDictionary {
            return this.viewData;
        }

        public get AppId(): string {
            return this.applicationIdentifier;
        }

        public get FullControllerName(): string {
            return this.controllerName;
        }

        public get Name(): string {
            return this.controllerName.split("Controller")[0];
        }

    }

    export class Controller extends ControllerBase {
        public constructor(controllerName: string, applicationIdentifier: string) {
            super(controllerName, applicationIdentifier);
        }

        public View(actionViewModel: any, viewModelController?: any, viewModel?: MVC.IViewModel): IActionResult {
            var typeofActionViewModel: string = typeof actionViewModel,
                typeofViewModelController: string = typeof viewModelController,
                typeofViewModel: string = typeof viewModel,
                view: IView = null;

            Args.IsNotNull(actionViewModel, "actionViewModel");

            if (typeofActionViewModel === "string") {
                if (typeofViewModelController === "string") {
                    if (!Args.IsNull(typeofViewModel)) {
                        // handle action, controller, viewmodel
                        viewModel.View = new View(ViewBase
                            .GetHtmlString(
                                viewModelController,
                                "{0}.html"
                                    .replace("{0}", actionViewModel)));
                        return new ViewResult(viewModel.View, this.ViewData);
                    } else {
                        // handle action, controller
                        view = new View(ViewBase
                            .GetHtmlString(
                                viewModelController,
                                "{0}.html"
                                    .replace("{0}", actionViewModel)));
                        return new ViewResult(view, this.ViewData);
                    }
                } else if (!Args.IsNull(typeofViewModelController)) {
                    // handle action, viewmodel
                    view = new View(ViewBase.GetHtmlString(this.Name, "{0}/{0}.html".replace("{0}", actionViewModel)));
                    viewModelController.View = view;
                    return new ViewResult(viewModelController.View, this.ViewData);
                } else {
                    // handle action
                    view = new View(ViewBase.GetHtmlString(this.Name, "{0}/{0}.html".replace("{0}", actionViewModel)));
                    return new ViewResult(view, this.ViewData);
                }
            } else if (!Args.IsNull(actionViewModel)) {
                // handle viewModel
                return new ViewResult(actionViewModel.View, this.ViewData);
            } else {
                // handle error
                throw new ArgumentException("actionViewModel",
                    "Cannot find action. The {0} parameter needs to be set to an action name or MVC.IViewModel instance.");
            }
        }
    }
}