/// <reference path="../../Core/Core.ts" />
/// <reference path="../../View/ViewModel.ts" />

module Demo {
    "use strict";

    export class NameDescriptionViewModel extends MVC.ViewModel {
        public constructor(view?: any, model?: any) {
            super(view, model);
        }

        public get Name(): string {
            return this.GetPropertyItem<string>("name");
        }

        public set Name(value: string) {
            this.SetPropertyItem("name", value);
        }

        public get Description(): string {
            return this.GetPropertyItem<string>("description");
        }

        public set Description(value: string) {
            this.SetPropertyItem("name", value);
        }
    }
}