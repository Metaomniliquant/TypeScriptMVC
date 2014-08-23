/// <reference path="../Core/Core.ts" />
/// <reference path="../Controller.ts" />
/// <reference path="ViewContext.ts" />

module MVC {
    "use strict";

    export interface IControllerContext extends IContext {
        Controller: IController;
        RouteData: IRouteData;
        RequestContext: IRequestContext;
        ViewContext: IViewContext;
    }

    export class ControllerContextBase extends ContextBase implements IControllerContext {
        private viewContext: IViewContext;

        public constructor(private controller: IController,
            private routeData: IRouteData,
            private requestContext: IRequestContext,
            loc?: Location, nav?: Navigator) {
            super(loc, nav);

            this.viewContext = null;
        }

        public get Controller(): IController {
            return this.controller;
        }

        public get RouteData(): IRouteData {
            return this.routeData;
        }

        public get RequestContext(): IRequestContext {
            return this.requestContext;
        }

        public get ViewContext(): IViewContext {
            return this.viewContext;
        }

        public set ViewContext(viewContext: IViewContext) {
            this.viewContext = viewContext;
        }
    }

    export class ControllerContext extends ControllerContextBase {
    }
}