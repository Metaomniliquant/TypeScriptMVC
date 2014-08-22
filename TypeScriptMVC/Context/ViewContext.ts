/// <reference path="../Core/Core.ts" />
/// <reference path="../View/DataDictionary.ts" />
/// <reference path="ControllerContext.ts" />

module MVC {
    "use strict";

    export interface IViewContext extends IControllerContext {
        ViewData: ViewDataDictionary;
        View: IView;
    }

    export class ViewContextBase extends ControllerContext implements IViewContext {
        public constructor(private controllerContext: ControllerContext,
            private view: IView,
            private viewData: ViewDataDictionary = new ViewDataDictionary()) {
            super(controllerContext.Controller,
                controllerContext.RouteData,
                controllerContext.RequestContext,
                controllerContext.Location,
                controllerContext.Navigator);
        }

        public get ViewData(): ViewDataDictionary {
            return this.viewData;
        }

        public get View(): IView {
            return this.view;
        }
    }

    export class ViewContext extends ViewContextBase {
    }
}