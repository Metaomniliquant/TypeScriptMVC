/// <reference path="Core/Core.ts" />
/// <reference path="Routing/RouteData.ts" />
/// <reference path="Routing/HashWatcher.ts" />
/// <reference path="Routing/Router.ts" />
/// <reference path="View/View.ts" />
/// <reference path="Controller.ts" />
/// <reference path="AppConfig.ts" />

module MVC {
    "use strict";

    export interface IApplication {
        Router: IRouter;
        Root: IView;
        HashWatcher: IWatcher<string>;
        Context: IContext;
        RegisterController: (controller: IController, name: string) => IApplication;
        Controllers: ICollection<IController>;
        ControllerLocator: IControllerLocator;
        LocateControllers: () => void;
        AppConfig: IAppConfig;
        UniqueIdentifier: string;
    }

    export interface IApplicationInitializer extends IApplication {
        Start(): void;
        Error(): void;
        Stop(): void;
    }

    export interface IUserApplication extends IApplication {
        Application_Start: () => void;
        Application_Error: () => void;
    }

    export class ApplicationBase extends CoreObject implements IApplication {
        private uniqueIdentifier: string;
        private static applications: IDictionary<string, IApplicationInitializer> = new Dictionary<string, IApplicationInitializer>();
        private router: IRouter;
        private root: IView;
        private hashWatcher: IWatcher<string>;
        private controllers: ICollection<IController>;
        private context: IContext;
        private controllerLocator: IControllerLocator;
        public constructor(private config: IAppConfig) {
            super();

            this.uniqueIdentifier = this.config.UniqueIdentifier;

            var requestContext: IRequestContext = new RequestContext();
            this.router = new Router(requestContext);
            this.root = new View(undefined, document.body);
            this.context = RequestContext.Current;
            this.hashWatcher = new HashWatcher(this.router, this.context);
            this.controllerLocator = new ControllerLocator(this.config.AppNamespace);
        }
        public get Router(): IRouter {
            return this.router;
        }
        public get Root(): IView {
            return this.root;
        }
        public set Root(root: IView) {
            this.root = root;
        }
        public get HashWatcher(): IWatcher<string> {
            return this.hashWatcher;
        }
        public get Context(): IRequestContext {
            return this.context;
        }
        public get Controllers(): ICollection<IController> {
            return this.controllers;
        }
        public get ControllerLocator(): IControllerLocator {
            return this.controllerLocator;
        }
        public get AppConfig(): IAppConfig {
            return this.config;
        }
        public get UniqueIdentifier(): string {
            return this.uniqueIdentifier;
        }
        public RegisterController(controller: IController, name: string): IApplication {
            this.Router.Process(controller, name);

            return this;
        }
        public LocateControllers(): void {
            this.controllers = this.controllerLocator.Process();
        }
        public static Run(application: IApplicationInitializer): void {
            Args.IsNotNull(application, "application");

            if (!ApplicationBase.applications.Contains(application.UniqueIdentifier)) {
                ApplicationBase.applications.Add(application.UniqueIdentifier, application);
            }

            application.Start();
        }
        public static Instance(uniqueIdentifier: string): IApplication {
            if (Args.IsNull(ApplicationBase.applications)) {
                throw new NullReferenceException();
            }

            if (!ApplicationBase.applications.Contains(uniqueIdentifier)) {
                throw new ArgumentOutOfRangeException("uniqueIdentifier");
            } else {
                return ApplicationBase.applications.Get(uniqueIdentifier);
            }
        }
    }

    export class Application extends ApplicationBase implements IApplicationInitializer, IUserApplication {
        public Start(): void {
            this.Application_Start();

            this.LocateControllers();

            this.HashWatcher.Watch();
        }

        public Application_Start(): void {
            this.Router.MapPath(new RouteDefinition("{controller}/{action}"));
            this.Router.MapPath(new RouteDefinition("{controller}/{action}/{id}"));
        }

        public Error(): void {
            this.Application_Error();
        }

        public Application_Error(): void {
            var routeData: IRouteData = new RouteData();
            routeData.Add("Error");
            routeData.Add("Index");

            this.Router.ProcessRoute(routeData);
        }

        public Stop(): void {
            this.HashWatcher.Ignore();
        }
    }
}