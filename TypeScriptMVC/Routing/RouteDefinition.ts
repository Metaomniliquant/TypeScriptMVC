/// <reference path="../Core/Core.ts" />
/// <reference path="../Core/Parsing.ts" />
/// <reference path="RouteData.ts" />

module MVC {
    "use strict";

    export interface IRouteDefinition extends IParser<string, IRouteData> {
        UrlTemplate: string;
        RouteData: IRouteData;
        Match: (routeData: IRouteData) => boolean;
    }

    export class RouteDefinition extends CoreObject implements IRouteDefinition {
        private routeData: IRouteData;
        private urlTemplate: string;
        public constructor(urlTemplate: string) {
            super();

            var parsedObj: IParsedObject<string, IRouteData> = this.Parse(urlTemplate);

            this.urlTemplate = parsedObj.Original;
            this.routeData = parsedObj.Value;
        }

        public get UrlTemplate(): string {
            return this.urlTemplate;
        }

        public get RouteData(): IRouteData {
            return this.routeData;
        }

        public Match(routeData: IRouteData): boolean {
            var result: boolean = false;

            if (this.routeData.Count === routeData.Count) {
                result = true;
            }

            if (result) {
                result = this.routeData.toString() === routeData.toString();
            }

            return result;
        }

        Parse(urlTemplate: string): IParsedObject<string, IRouteData> {
            Args.IsNotNull(urlTemplate, "url");

            var routeData: IRouteData = new RouteData();

            var urlElements: Array<string> = urlTemplate.split("/");

            for (var i: number = 0; i < urlElements.length; i++) {
                var urlElement: string = urlElements[i];
                if (!Args.IsNull(urlElement) && urlElement.length > 0) {
                    routeData.Add(urlElement);
                }
            }

            return new ParsedObject(urlTemplate, routeData);
        }
    }
}