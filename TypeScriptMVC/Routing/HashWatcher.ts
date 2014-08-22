/// <reference path="../Core/Core.ts" />
/// <reference path="../Core/Collections.ts" />
/// <reference path="../Core/Parsing.ts" />
/// <reference path="Router.ts" />

module MVC {
    "use strict";

    export interface IWatchedObject<T> {
        Value: T;
    }

    export interface IWatchHandler<T> {
        OnWatchedChange: (watched: IWatchedObject<T>) => void;
        OnWatchedIgnore: () => void;
    }

    export interface IWatcher<T> {
        Watch: () => void;
        Ignore: () => void;
    }

    export class WatcherBase<T> extends CoreObject implements IWatcher<T> {
        public constructor(private handler: IWatchHandler<T>) {
            super();
        }

        public Watch(): void {
            this.handler.OnWatchedChange(null);
        }

        public Ignore(): void {
            this.handler.OnWatchedIgnore();
        }

        public get Handler(): IWatchHandler<T> {
            return this.handler;
        }
    }

    export class HashWatchedObject extends CoreObject implements IWatchedObject<string> {
        public constructor(private value: string) {
            super();
        }
        public get Value(): string {
            return this.value;
        }
        public set Value(value: string) {
            this.value = value;
        }
    }

    export class HashWatcher extends WatcherBase<string> {
        public constructor(handler: IWatchHandler<string>, private context: IContext) {
            super(handler);

            Args.IsNotNull(context, "context");
        }
        public Watch(): void {
            window.addEventListener("hashchange", this.HashChangeHandler.bind(this), false);
        }
        public Ignore(): void {
            window.removeEventListener("hashchange", this.HashChangeHandler, false);
            this.Handler.OnWatchedIgnore();
        }
        private HashChangeHandler(evt: Event): any {
            this.Handler.OnWatchedChange(new HashWatchedObject(this.context.Location.hash));
        }
    }
}