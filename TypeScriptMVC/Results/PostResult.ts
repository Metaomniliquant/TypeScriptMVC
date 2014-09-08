/// <reference path="ActionResult.ts" />

module MVC {
    "use strict";

    export class PostResultBase extends CoreObject implements IActionResult {
        public constructor(private view: IView, private viewData: ViewDataDictionary) {
            super();
        }

        public get View(): IView {
            return this.view;
        }

        public get ViewData(): ViewDataDictionary {
            return this.viewData;
        }

        public ExecuteResult(controllerContext: ControllerContext): void {
            Args.IsNotNull(controllerContext, "controllerContext");

            var viewContext: IViewContext = new ViewContext(controllerContext, this.View, this.ViewData);

            this.view.Render(viewContext);
        }
    }

    export class PostResult extends PostResultBase {
    }
} 