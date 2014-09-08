/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export class DefaultLocation extends CoreObject implements Location {
        public constructor(private loc?: Location) {
            super();

            if (Args.IsNull(this.loc)) {
                this.loc = DefaultWindow.Get().location;
            }
        }
        public get hash(): string {
            return this.loc.hash;
        }
        public get protocol(): string {
            return this.loc.protocol;
        }
        public get search(): string {
            return this.loc.search;
        }
        public get href(): string {
            return this.loc.href;
        }
        public get hostname(): string {
            return this.loc.hostname;
        }
        public get port(): string {
            return this.loc.port;
        }
        public get pathname(): string {
            return this.loc.pathname;
        }
        public get host(): string {
            return this.loc.host;
        }
        public reload(flag?: boolean): void {
            this.loc.reload(flag);
        }
        public replace(url: string): void {
            this.loc.replace(url);
        }
        public assign(url: string): void {
            this.loc.assign(url);
        }
    }

    export class DefaultNavigator extends CoreObject implements Navigator {
        public constructor(private nav?: Navigator) {
            super();

            if (Args.IsNull(this.nav)) {
                this.nav = DefaultWindow.Get().navigator;
            }
        }
        public get language(): string {
            return this.nav.language;
        }
        public get geolocation(): Geolocation {
            return this.nav.geolocation;
        }
        public get msDoNotTrack(): string {
            return this.nav.msDoNotTrack;
        }
        public removeSiteSpecificTrackingException(args: ExceptionInformation): void {
            this.nav.removeSiteSpecificTrackingException(args);
        }
        public removeWebWideTrackingException(args: ExceptionInformation): void {
            this.nav.removeWebWideTrackingException(args);
        }
        public storeSiteSpecificTrackingException(args: StoreSiteSpecificExceptionsInformation): void {
            this.nav.storeSiteSpecificTrackingException(args);
        }
        public storeWebWideTrackingException(args: StoreExceptionsInformation): void {
            this.nav.storeWebWideTrackingException(args);
        }
        public confirmSiteSpecificTrackingException(args: ConfirmSiteSpecificExceptionsInformation): boolean {
            return this.nav.confirmSiteSpecificTrackingException(args);
        }
        public confirmWebWideTrackingException(args: ExceptionInformation): boolean {
            return this.nav.confirmWebWideTrackingException(args);
        }
        public msSaveBlob(blob: any, defaultName?: string): boolean {
            return this.nav.msSaveBlob(blob, defaultName);
        }
        public msSaveOrOpenBlob(blob: any, defaultName?: string): boolean {
            return this.nav.msSaveOrOpenBlob(blob, defaultName);
        }
        public get userLanguage(): string {
            return this.nav.userLanguage;
        }
        public get browserLanguage(): string {
            return this.nav.browserLanguage;
        }
        public get systemLanguage(): string {
            return this.nav.systemLanguage;
        }
        public javaEnabled(): boolean {
            return this.nav.javaEnabled();
        }
        public get mimeTypes(): MSMimeTypesCollection {
            return this.nav.mimeTypes;
        }
        public get plugins(): MSPluginsCollection {
            return this.nav.plugins;
        }
        public get cookieEnabled(): boolean {
            return this.nav.cookieEnabled;
        }
        public get cpuClass(): string {
            return this.nav.cpuClass;
        }
        public get msMaxTouchPoints(): number {
            return this.nav.msMaxTouchPoints;
        }
        public get maxTouchPoints(): number {
            return this.nav.maxTouchPoints;
        }
        public get msPointerEnabled(): boolean {
            return this.nav.msPointerEnabled;
        }
        public get pointerEnabled(): boolean {
            return this.nav.pointerEnabled;
        }
        public get vendor(): string {
            return this.nav.vendor;
        }
        public get appMinorVersion(): string {
            return this.nav.appMinorVersion;
        }
        public get onLine(): boolean {
            return this.nav.onLine;
        }
        public get connectionSpeed(): number {
            return this.nav.connectionSpeed;
        }
        public get msManipulationViewsEnabled(): boolean {
            return this.nav.msManipulationViewsEnabled;
        }
        public msLaunchUri(uri: string, successCallback?: MSLaunchUriCallback, noHandlerCallback?: MSLaunchUriCallback): void {
            this.nav.msLaunchUri(uri, successCallback, noHandlerCallback);
        }
        public get appCodeName(): string {
            return this.nav.appCodeName;
        }
        public get appName(): string {
            return this.nav.appName;
        }
        public get appVersion(): string {
            return this.nav.appVersion;
        }
        public get platform(): string {
            return this.nav.platform;
        }
        public get product(): string {
            return this.nav.product;
        }
        public taintEnabled(): boolean {
            return this.nav.taintEnabled();
        }
        public get userAgent(): string {
            return this.nav.userAgent;
        }
    }

    export class DefaultWindow extends CoreObject {
        public static Get(): Window {
            var that: string = "this";
            return (0,eval)(that);
        }
    }

    export class DefaultDocument extends CoreObject {
        public static Get(): Document {
            var win: Window;
            win = DefaultWindow.Get();

            return win.document;
        }
    }
}