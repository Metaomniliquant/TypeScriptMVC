/// <reference path="../Core/Core.ts" />
/// <reference path="../Core/Dictionary.ts" />
/// <reference path="../Core/Collections.ts" />
/// <reference path="../Core/Parsing.ts" />
/// <reference path="RouteData.ts" />
/// <reference path="RouteDefinition.ts" />
/// <reference path="../Controller.ts" />
/// <reference path="ControllerRegistry.ts" />

module MVC {
    "use strict";

    export class RouteDisabledException extends CoreException {
        public constructor() {
            super("Route processing has been disabled.");
        }
    }

    export interface IRouter extends IParser<string, IRouteData>, IWatchHandler<string> {
        Definitions: Array<IRouteDefinition>;
        Match: (url: string) => IRouteDefinition;
        MapPath: (definition: IRouteDefinition) => IRouter;
        Process: (controller: IController) => void;
        ProcessRoute: (route: IRouteData) => void;
        RequestContext: IRequestContext;
    }

    export class RouterBase extends CoreObject implements IRouter {
        private definitions: Array<IRouteDefinition>;
        private registry: IControllerRegistry;

        public constructor(private requestContext: IRequestContext) {
            super();

            this.registry = new ControllerRegistry();
            this.definitions = new Array<IRouteDefinition>();
        }

        public get Definitions(): Array<IRouteDefinition> {
            return this.definitions;
        }

        public get RequestContext(): IRequestContext {
            return this.requestContext;
        }

        public OnWatchedChange(watched: IWatchedObject<string>): void {
            Args.IsNotNull(watched, "watched");

            var hash: string = watched.Value,
                parsedObject: IParsedObject<string, IRouteData> = this.Parse(hash),
                routeData: IRouteData = parsedObject.Value;

            this.ProcessRoute(routeData);
        }

        public OnWatchedIgnore(): void {
            throw new RouteDisabledException();
        }

        public Parse(url: string): IParsedObject<string, IRouteData> {
            Args.IsNotNull(url, "url");

            var routeData: IRouteData = new RouteData();

            var urlElements: Array<string> = url.split("#")[1].split("/");

            for (var i: number = 0; i < urlElements.length; i++) {
                var urlElement: string = urlElements[i];
                if (!Args.IsNull(urlElement) && urlElement.length > 0) {
                    routeData.Add(urlElement);
                }
            }

            return new ParsedObject(url, routeData);
        }

        public Match(url: string): IRouteDefinition {
            var result: IRouteDefinition = null;

            var parsedUrl: IParsedObject<string, IRouteData> = this.Parse(url);

            for (var i: number = 0; i < this.definitions.length; i++) {
                var definition: IRouteDefinition = this.definitions[i];
                if (!Args.IsNull(definition)) {
                    if (definition.Match(parsedUrl.Value)) {
                        result = definition;
                        break;
                    }
                }
            }

            return result;
        }

        public MapPath(definition: IRouteDefinition): IRouter;
        public MapPath(definition: string): IRouter;
        public MapPath(definition: any): IRouter {
            if (typeof definition === "string") {
                this.definitions.push(new RouteDefinition(definition));
            } else if (definition instanceof CoreObject) {
                this.definitions.push(definition);
            }

            return this;
        }

        public Process(controller: IController): void {
            var item: IControllerRegistryItem = null;

            Args.IsNotNull(controller, "controller");

            var name: string = controller.FullControllerName;

            item = this.registry.GetRegistryItem(controller, name);

            if (Args.IsNull(item)) {
                var actions: ICollection<string> = this.GetActionMethods(controller);
                var registryItem: IControllerRegistryItem = new ControllerRegistryItem(controller, name, actions);

                this.registry.Add(registryItem);
            }
        }

        private GetActionMethods(controller: IController): ICollection<string> {
            var member: string = null,
                results: ICollection<string> = new Collection<string>();

            for (member in controller) {
                if (typeof controller[member] === "function" && member.lastIndexOf("Action") > 0) {
                    var names: Array<string> = member.split("Action");
                    var lastName: string = names[names.length - 1];
                    if (Args.IsNull(lastName) || lastName === "") {
                        names.pop();
                    }

                    results.Add(names.join());
                }
            }

            return results;
        }

        private EnsureActionMethod(actionMethod: (id?:string) => IActionResult, controllerName: string, action: string): void {
            if (Args.IsNull(actionMethod)) {
                var msg: string = "Cannot find action '{0}' on controller '{1}'."
                    .replace("{0}", action)
                    .replace("{1}", controllerName);
                throw new TargetException(msg);
            }
        }

        private EnsureActionResult(actionResult: IActionResult): void {
            if (Args.IsNull(actionResult)) {
                var format: string = "Cannot process result. {0}",
                    actionMsg: string = "Action methods must return an object or derivative of IActionResult.",
                    msg: string = format.replace("{0}", actionMsg);

                throw new TargetException(msg);
            }
        }

        public ProcessRoute(route: IRouteData): void {
            Args.IsNotNull(route, "route");

            var controllerName: string = route.Get(0),
                registryItem: IControllerRegistryItem = this.registry.FindByName(controllerName),
                controller: IController = registryItem.Controller,
                defaultAction: string = "Index",
                actionResult: IActionResult = null;

            if (route.Count > 1) {
                var actionName: string = route.Get(1),
                    actionIndex: number = registryItem.Actions.IndexOf(actionName),
                    action: string = registryItem.Actions.Get(actionIndex),
                    actionNameFull: string = action + "Action",
                    actionMethod: (id: string) => IActionResult = controller[actionNameFull];

                this.EnsureActionMethod(actionMethod, controllerName, actionName);

                if (route.Count > 2) {
                    actionResult = actionMethod.call(controller, route.Get(2));
                } else {
                    actionResult = actionMethod.call(controller);
                }
            } else {
                actionResult = controller[defaultAction].call(controller);
            }

            this.EnsureActionResult(actionResult);

            var controllerContext: ControllerContext =
                new ControllerContext(controller,
                    route,
                    this.RequestContext,
                    this.requestContext.Location,
                    this.requestContext.Navigator);

            actionResult.ExecuteResult(controllerContext);
        }
    }

    export class Router extends RouterBase {
    }
}