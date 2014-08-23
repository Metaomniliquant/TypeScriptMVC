/// <reference path="../../View/ViewModel.ts" />

module Mock {
    "use strict";

    export class MockViewModel extends MVC.ViewModel {
        public get Name(): string {
            return this.GetPropertyItem<string>("name");
        }

        public set Name(name: string) {
            this.SetPropertyItem<string>("name", this.Model.name);
        }

        public get Count(): number {
            return this.GetPropertyItem<number>("count");
        }

        public set Count(count: number) {
            this.SetPropertyItem<number>("count", this.Model.count);
        }

        public get Names(): Array<string> {
            return this.GetPropertyArray<string>("names");
        }

        public set Names(names: Array<string>) {
            this.SetPropertyArray<string>("names", this.Model.names);
        }
    }
}