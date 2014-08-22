/// <reference path="../Core/Collections.ts" />

module MVC {
    "use strict";

    export interface IRouteData extends ICollection<string> {
    }

    export class RouteData extends Collection<string> implements IRouteData {
        public constructor() {
            super();
        }
    }

    export class RouteDataCollection extends Collection<RouteData> {
        public constructor() {
            super();
        }
    }
}