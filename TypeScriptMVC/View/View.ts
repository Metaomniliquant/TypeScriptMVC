/// <reference path="../Core/Core.ts" />
/// <reference path="../Binding/Knockout.d.ts" />

module MVC {
    "use strict";

    export interface IView {
        String: string;
        Html: HTMLElement;
        UniqueId: string;
        ViewModel: IViewModel;
        Render: (viewContext: IViewContext) => void;
    }

    export class ViewBase extends CoreObject implements IView {
        private viewModel: IViewModel;
        private uniqueId: string;

        public constructor(private html: string = null, private element: HTMLElement = null) {
            super();

            if (this.html === null || this.html === "") {
                if (this.element == null) {
                    if (Args.IsNull(html) && Args.IsNull(element)) {
                        throw new ArgumentNullException("html, element, or url",
                            "At least one of the {0} parameters must be set.");
                    }
                } else {
                    this.html = this.element.innerHTML;
                }
            } else if (this.element == null) {
                var elem: HTMLElement = document.createElement("div");
                elem.innerHTML = this.html;

                this.element = elem;
            } else {
                this.html = html;
                this.element = element;
            }

            this.uniqueId = Date.now().toString(16);
        }

        public get String(): string {
            return this.html;
        }

        public get Html(): HTMLElement {
            return this.element;
        }

        public get ViewModel(): IViewModel {
            return this.viewModel;
        }

        public set ViewModel(viewModel: IViewModel) {
            this.viewModel = viewModel;
        }

        public get UniqueId(): string {
            return this.uniqueId;
        }

        private Application(appId: string): IApplication {
            return DependencyResolver.Current.GetService<IApplication>(
                DIKeys.Application(appId));
        }

        public Render(viewContext: IViewContext): void {
            Args.IsNotNull(viewContext, "viewContext");

            var application: IApplication = this.Application(viewContext.Controller.AppId);
            var root: HTMLElement = application.Root.Html;
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }

            var html: HTMLElement = document.createElement("div");
            if (!Args.IsNull(html.className)) {
                html.className += "mvc-view ";
                html.className += this.uniqueId;
            }

            if (!Args.IsNull(this.element.firstChild) && this.element.firstChild.nodeName.toLowerCase() === "script") {
                html.innerHTML = this.element.getElementsByTagName("script").item(0).innerHTML;
            } else {
                html.innerHTML = this.element.innerHTML;
            }

            root.appendChild(html);

            this.ViewModel.ModelBinder.PerformBinding(viewContext);
        }

        static EnsureTemplate(url: string): HTMLElement {
            var i: number = 0;

            var scripts: NodeListOf<HTMLScriptElement> = document.getElementsByTagName("script");
            if (scripts.length) {
                for (; i < scripts.length; i++) {
                    var script: HTMLScriptElement = scripts.item(i);

                    var dataPath: Attr = script.attributes.getNamedItem("data-path");

                    if (!Args.IsNull(dataPath) && dataPath.value !== "") {
                        var path: string = dataPath.value;

                        if (path.toLowerCase() === url.toLowerCase()) {
                            return script;
                        }
                    }
                }
            }

            return null;
        }

        static GetTemplate(url: string, handler: (xhr: XMLHttpRequest) => void): void {
            MVC.Args.IsNotNull(url, "url");

            var request: IAjaxRequest;

            request = new MVC.AjaxRequest(url);

            request.Send(null, "get", false, "text/html", handler);
        }

        static GetHtmlString(urlController: string, actionName?: string, fileName?: string): string {
            var html: string = "",
                url: string = "",
                elem: HTMLElement = null;

            MVC.Args.IsNotNull(urlController, "urlController");

            if (MVC.Args.IsNull(actionName)) {
                // handle url
                url = urlController;
            } else if (!MVC.Args.IsNull(actionName)) {
                if (MVC.Args.IsNull(fileName)) {
                    // handle controller/actionName
                    url = "Templates/{0}/{1}"
                        .replace("{0}", urlController)
                        .replace("{1}", actionName);
                } else {
                    // handle controller/action/filename.html
                    url = "Templates/{0}/{1}/{2}"
                        .replace("{0}", urlController)
                        .replace("{1}", actionName)
                        .replace("{2}", fileName);
                }

                elem = ViewBase.EnsureTemplate(url);

                if (elem != null) {
                    html = elem.innerHTML;
                } else {
                    ViewBase.GetTemplate(url, (xhr: XMLHttpRequest): void => {
                        if (xhr.status === 200) {
                            html = xhr.responseText;
                        }
                    });
                }
            }

            return html;
        }
    }

    export class View extends ViewBase {
    }

    export class StaticView extends View {
    }

    export class TemplateView extends View {
    }
}