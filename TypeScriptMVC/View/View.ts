/// <reference path="../Core/Core.ts" />
/// <reference path="../Binding/Knockout.d.ts" />

module MVC {
    "use strict";

    export interface IView {
        String: string;
        Html: HTMLElement;
        ViewModel: IViewModel;
        Render: (viewContext: IViewContext) => void;
    }

    export class ViewBase extends CoreObject implements IView {
        private viewModel: IViewModel;

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

        public Render(viewContext: IViewContext): void {
            Args.IsNotNull(viewContext, "viewContext");

            DependencyResolver.Current.GetService<IApplication>(
                DIKeys.Application(viewContext.Controller.ApplicationIdentifier))
                    .Root.Html.appendChild(this.Html);

            this.ViewModel.ModelBinder.PerformBinding(viewContext);
        }

        static GetTemplate(url: string, handler: (xhr: XMLHttpRequest) => void): void {
            MVC.Args.IsNotNull(url, "url");

            var request: MVC.IAjaxRequest = new MVC.AjaxRequest(url);
            request.Send(null, "get", false, "text/html", handler);
        }


        static GetHtmlString(urlController: string, actionName?: string, fileName?: string): string {
            var html: string = "",
                url: string = urlController;

            MVC.Args.IsNotNull(urlController, "urlController");

            if (MVC.Args.IsNull(actionName)) {
                // handle url
                ViewBase.GetTemplate(url, (xhr: XMLHttpRequest): void => {
                    html = xhr.responseText;
                });
            } else if (!MVC.Args.IsNull(actionName)) {
                if (MVC.Args.IsNull(fileName)) {
                    // handle controller/actionName
                    url = "Templates/{0}/{1}"
                        .replace("{0}", urlController)
                        .replace("{1}", actionName);

                    ViewBase.GetTemplate(url, (xhr: XMLHttpRequest): void => {
                        html = xhr.responseText;
                    });
                } else {
                    // handle controller/action/filename.html
                    url = "Templates/{0}/{1}/{2}"
                        .replace("{0}", urlController)
                        .replace("{1}", actionName)
                        .replace("{2}", fileName);
                    ViewBase.GetTemplate(url, (xhr: XMLHttpRequest): void => {
                        html = xhr.responseText;
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