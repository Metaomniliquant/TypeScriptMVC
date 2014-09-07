/// <reference path="../Core/Core.ts" />

module Demo {
    "use strict";

    export class AppConfig extends MVC.AppConfigBase {
        public get AppNamespace(): Object {
            return Demo;
        }

        public get RootPath(): string {
            return "../../";
        }

        public get UniqueIdentifier(): string {
            return new Date(2014, 8, 24, 2, 26, 45, 100).getTime().toString();
        }
    }

    export class DemoApplication extends MVC.Application {
        public constructor() {
            super(new AppConfig());
        }

        public Application_Start(): void {
            this.Router.MapPath(new MVC.RouteDefinition("/{controller}/{action}",
                { controller: "Home", action: "Index" }));

            this.Router.MapPath(new MVC.RouteDefinition("/{controller}/{action}/{id}",
                { controller: "Home", action: "Index", id: null }));
        }

        public Application_Error(): void {
            var routeData: MVC.IRouteData = new MVC.RouteData();
            routeData.Add("Error");
            routeData.Add("Index");

            this.Router.ProcessRoute(routeData);
        }
    }
}