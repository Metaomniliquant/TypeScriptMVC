/// <reference path="View.ts" />
/// <reference path="../Binding/Knockout.d.ts" />

module MVC {
    "use strict";

    export interface IViewModel {
        View: IView;
        Model: any;
        BindingObject: any;
        GetPropertyItem: <T>(name: string) => T;
        GetPropertyArray: <T>(name: string) => Array<T>;
        SetPropertyItem: <T>(name: string, value: T) => void;
        SetPropertyArray: <T>(name: string, value: Array<T>) => void;
    }

    export class ViewModelBase extends CoreObject implements IViewModel {
        private bindingObject: any;

        public constructor(private view: IView, private model: any) {
            super();

            Args.IsNotNull(view, "view");

            var m: string = null;

            this.view.ViewModel = this;

            this.bindingObject = new Object();

            if(!Args.IsNull(model)) {
                for (m in model) {
                    if (typeof model[m] !== "function") {
                        var member: any = model[m];
                        if (typeof member.length === "undefined" || typeof member === "string") {
                            this.bindingObject[m] = this.View.ModelBinder.GetBoundItem(member);
                        } else {
                            this.bindingObject[m] = this.View.ModelBinder.GetBoundArray(member);
                        }
                    }
                }
            }
        }

        public get View(): IView {
            return this.view;
        }

        public get Model(): any {
            return this.model;
        }

        public get BindingObject(): any {
            return this.bindingObject;
        }

        public GetPropertyItem<T>(name: string): T {
            var member: any = this.bindingObject[name];

            if (!Args.IsNull(member)) {
                return this.View.ModelBinder.GetItem(member);
            }

            return member;
        }

        public GetPropertyArray<T>(name: string): Array<T> {
            var member: any = this.bindingObject[name];

            if (!Args.IsNull(member)) {
                return this.View.ModelBinder.GetArray(member);
            }

            return member;
        }

        public SetPropertyItem<T>(name: string, value: T): void {
            this.bindingObject[name] = this.View.ModelBinder.GetBoundItem(value);
        }

        public SetPropertyArray<T>(name: string, value: Array<T>): void {
            this.bindingObject[name] = this.View.ModelBinder.GetBoundArray(value);
        }
    }

    export class ViewModel extends ViewModelBase {
    }
}