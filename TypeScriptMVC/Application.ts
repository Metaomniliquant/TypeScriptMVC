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
    }

    export interface IApplicationInitializer extends IApplication {
        Start(): void;
        Error(): void;
        Stop(): void;
        Initialize(): void;
    }

    export interface IUserApplication extends IApplication {
        Application_Start: () => void;
        Application_Error: () => void;
    }

    export class ApplicationBase extends CoreObject implements IApplication {
        private root: IView;
        private controllers: ICollection<IController>;
        public constructor(private config: IAppConfig) {
            super();
        }
        public Initialize(): void {
            var defaultHtml: string = "";

            var key: string = DIKeys.AppId(this.config.UniqueIdentifier);
            DependencyResolver.Current.RegisterInstance(key, this.config.UniqueIdentifier);

            defaultHtml = this.DefaultHtml;

            this.root = new View(defaultHtml, undefined);
            this.root.Html.setAttribute("data-application", this.config.UniqueIdentifier);
        }
        public RegisterController(controller: IController): IApplication {
            this.Router.Process(controller);

            return this;
        }
        public LocateControllers(): void {
            this.controllers = this.ControllerLocator.Process(this.AppConfig.UniqueIdentifier);
        }
        private get DefaultHtml(): string {
            var result: string = "",
                documentContext: IDocumentContext = null,
                document: Document = null;

            documentContext = DependencyResolver.Current
                .GetService<IDocumentContext>(DIKeys.DocumentContext(this.AppConfig.UniqueIdentifier));
            document = documentContext.Document;

            var apps: NodeList = document.getElementsByClassName("application"),
                last: Node = null,
                temp: HTMLElement = null;

            if (!Args.IsNull(apps) && apps.length) {
                last = apps.item(apps.length - 1);

                temp = document.createElement("div");
                temp.appendChild(last);
                result = temp.innerHTML;
            } else {
                temp = document.createElement("div");
                if (temp.className) {
                    temp.className = "application";
                } else {
                    temp.setAttribute("class", "application");
                }

                result = temp.outerHTML;

                document.body.appendChild(temp);
            }

            return result;
        }
        public get Resolver(): IDependencyResolver {
            return DependencyResolver.Current;
        }
        public get Router(): IRouter {
            return this.Resolver.GetService<IRouter>(DIKeys.Router(this.AppConfig.UniqueIdentifier));
        }
        public get Root(): IView {
            return this.root;
        }
        public set Root(root: IView) {
            this.root = root;
        }
        public get HashWatcher(): IWatcher<string> {
            return this.Resolver.GetService<IWatcher<string>>(DIKeys.HashWatcher(this.AppConfig.UniqueIdentifier));
        }
        public get Context(): IRequestContext {
            return this.Resolver.GetService<IRequestContext>(DIKeys.RequestContext(this.AppConfig.UniqueIdentifier));
        }
        public get Controllers(): ICollection<IController> {
            return this.controllers;
        }
        public get ControllerLocator(): IControllerLocator {
            return this.Resolver.GetService<IControllerLocator>(DIKeys.ControllerLocator(this.AppConfig.UniqueIdentifier));
        }
        public get AppConfig(): IAppConfig {
            return this.config;
        }
        public static Run(application: IApplicationInitializer): void {
            Args.IsNotNull(application, "application");

            if(!DependencyResolver.Current.IsRegistered(DIKeys.Application(application.AppConfig.UniqueIdentifier))) {
                DependencyResolver.Current
                    .RegisterType(DIKeys.RequestContext(application.AppConfig.UniqueIdentifier), RequestContext)
                    .RegisterType(DIKeys.ModelBinder(), DefaultModelBinder)
                    .RegisterInstance(DIKeys.ControllerLocator(application.AppConfig.UniqueIdentifier),
                        new ControllerLocator(application.AppConfig.AppNamespace))
                    .RegisterInstance(DIKeys.Router(application.AppConfig.UniqueIdentifier), new Router(
                        DependencyResolver.Current.GetService<IRequestContext>(
                            DIKeys.RequestContext(application.AppConfig.UniqueIdentifier))))
                    .RegisterInstance(DIKeys.HashWatcher(application.AppConfig.UniqueIdentifier), new HashWatcher(
                        DependencyResolver.Current.GetService<IRouter>(DIKeys.Router(application.AppConfig.UniqueIdentifier)),
                        DependencyResolver.Current.GetService<IRequestContext>(
                            DIKeys.RequestContext(application.AppConfig.UniqueIdentifier))))
                    .RegisterInstance(DIKeys.Application(application.AppConfig.UniqueIdentifier), application)
                    .RegisterInstance(DIKeys.DocumentContext(application.AppConfig.UniqueIdentifier), new DocumentContext())
                    .RegisterInstance(DIKeys.DocumentContext(), new DocumentContext())
                    .RegisterInstance(DIKeys.WindowContext(application.AppConfig.UniqueIdentifier), new WindowContext());
            }

            application.Start();
        }
    }

    export class Application extends ApplicationBase implements IApplicationInitializer, IUserApplication {
        public Start(): void {
            this.Application_Start();

            this.Initialize();

            this.LocateControllers();

            this.HashWatcher.Watch();
        }

        public Application_Start(): void {
            this.Router.MapPath(new RouteDefinition("{controller}/{action}", null));
            this.Router.MapPath(new RouteDefinition("{controller}/{action}/{id}", null));
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