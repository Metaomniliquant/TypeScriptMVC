/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export interface ICollectionBase extends IUnknown {
        Count: number;
    }

    export interface ICollection<T> extends ICollectionBase {
        Add(item: T): void;
        Remove(item: T): void;
        Get(index: number): T;
        IndexOf(item: any): number;
        Items: Array<T>;
    }

    export class Collection<T> extends CoreObject implements ICollection<T> {
        private _items: Array<any>;

        public constructor() {
            super();

            this._items = new Array<any>();
        }
        public Add(item: T): void {
            this._items.push(item);
        }
        public Remove(item: T): void {
            var index: number = this.IndexOf(item);

            if (index >= 0) {
                delete this._items[index];

                var items: Array<T> = this._items;

                this._items = new Array<T>();

                var i: number = 0;

                for (i; i < items.length; i++) {
                    var value: T = items[i];
                    if (!Args.IsNull(value)) {
                        this._items.push(value);
                    }
                }
            }
        }
        public Get(index: number): T {
            if (this._items.length <= index) {
                throw new ArgumentOutOfRangeException("index");
            }

            return this._items[index];
        }
        public IndexOf(item: any): number {
            var useEquals: boolean = false;
            if (item instanceof CoreObject) {
                useEquals = true;
            }

            for (var i: number = 0; i < this._items.length; i++) {
                if (useEquals && typeof this._items[i].equals === "function") {
                    if (this._items[i].equals(item)) {
                        return i;
                    }
                } else {
                    if (this._items[i] === item) {
                        return i;
                    }
                }
            }

            return -1;
        }
        public get Count(): number {
            return Args.IsNull(this._items) ? -1 : this._items.length;
        }
        public get Items(): Array<T> {
            return this._items;
        }
    }
}