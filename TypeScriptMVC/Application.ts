/// <reference path="Core/Core.ts" />
/// <reference path="Core/DependencyResolver.ts" />
/// <reference path="Core/DIKeys.ts" />
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
        Resolver: IDependencyResolver;
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
        private root: IView;
        private controllers: ICollection<IController>;
        public constructor(private config: IAppConfig) {
            super();

            this.uniqueIdentifier = this.config.UniqueIdentifier;

            this.root = new View(undefined, document.body);
        }
        public get Resolver(): IDependencyResolver {
            return DependencyResolver.Current;
        }
        public get Router(): IRouter {
            return this.Resolver.GetService<IRouter>(DIKeys.Router(this.uniqueIdentifier));
        }
        public get Root(): IView {
            return this.root;
        }
        public set Root(root: IView) {
            this.root = root;
        }
        public get HashWatcher(): IWatcher<string> {
            return this.Resolver.GetService<IWatcher<string>>(DIKeys.HashWatcher(this.uniqueIdentifier));
        }
        public get Context(): IRequestContext {
            return this.Resolver.GetService<IRequestContext>(DIKeys.RequestContext(this.uniqueIdentifier));
        }
        public get Controllers(): ICollection<IController> {
            return this.controllers;
        }
        public get ControllerLocator(): IControllerLocator {
            return this.Resolver.GetService<IControllerLocator>(DIKeys.ControllerLocator(this.uniqueIdentifier));
        }
        public get AppConfig(): IAppConfig {
            return this.config;
        }
        public get UniqueIdentifier(): string {
            return this.uniqueIdentifier;
        }
        public RegisterController(controller: IController): IApplication {
            this.Router.Process(controller);

            return this;
        }
        public LocateControllers(): void {
            this.controllers = this.ControllerLocator.Process(this.uniqueIdentifier);
        }
        public static Run(application: IApplicationInitializer): void {
            Args.IsNotNull(application, "application");

            if(!DependencyResolver.Current.IsRegistered(DIKeys.Application(application.UniqueIdentifier))) {
                DependencyResolver.Current
                    .RegisterType(DIKeys.RequestContext(application.UniqueIdentifier), RequestContext)
                    .RegisterType(DIKeys.ModelBinder(), DefaultModelBinder)
                    .RegisterInstance(DIKeys.ControllerLocator(application.UniqueIdentifier),
                        new ControllerLocator(application.AppConfig.AppNamespace))
                    .RegisterInstance(DIKeys.Router(application.UniqueIdentifier), new Router(
                        DependencyResolver.Current.GetService<IRequestContext>(DIKeys.RequestContext(application.UniqueIdentifier))))
                    .RegisterInstance(DIKeys.HashWatcher(application.UniqueIdentifier), new HashWatcher(
                        DependencyResolver.Current.GetService<IRouter>(DIKeys.Router(application.UniqueIdentifier)),
                        DependencyResolver.Current.GetService<IRequestContext>(DIKeys.RequestContext(application.UniqueIdentifier))))
                    .RegisterInstance(DIKeys.Application(application.UniqueIdentifier), application);
            }

            application.Start();
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