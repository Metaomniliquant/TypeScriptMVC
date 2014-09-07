/// <reference path="../Core/Core.ts" />
/// <reference path="Knockout.d.ts" />

module MVC {
    "use strict";

    export interface IModelBinder {
        PerformBinding: (viewContext: IViewContext) => void;
        GetBoundItem: <T>(member: T) => any;
        GetBoundArray: <T>(member: Array<T>) => any;
        GetItem: <T>(member: T) => any;
        GetArray: <T>(member: Array<T>) => any;
    }

    export class ModelBinderBase extends CoreObject implements IModelBinder {
        public PerformBinding(viewContext: IViewContext): void {
            Args.IsNotNull(viewContext, "viewContext");

            var viewDataStr: string = "",
                model: any = null,
                app: IApplication = null;

            if (!Args.IsNull(viewContext.View) && !Args.IsNull(viewContext.View.ViewModel)) {
                viewDataStr = "ViewData";
                model = viewContext.View.ViewModel.BindingObject;

                if (!Args.IsNull(viewContext.ViewData)) {
                    model[viewDataStr] = viewContext.ViewData.DataItems;
                } else {
                    model[viewDataStr] = new Object();
                }

                app = DependencyResolver.Current
                    .GetService<IApplication>(DIKeys.Application(viewContext.Controller.AppId));

                document.body.appendChild(app.Root.Html);

                ko.applyBindings(model, app.Root.Html);
            }
        }

        public GetBoundItem<T>(value: T): any {
            return ko.observable(value);
        }

        public GetBoundArray<T>(value: Array<T>): any {
            return ko.observableArray(value);
        }

        public GetItem<T>(member: T): any {
            if (ko.isObservable(member)) {
                return ko.unwrap(member);
            }

            return member;
        }

        public GetArray<T>(member: Array<T>): any {
            if (ko.isObservable(member)) {
                return ko.unwrap(member);
            }

            return member;
        }
    }

    export class DefaultModelBinder extends ModelBinderBase {
    }
}