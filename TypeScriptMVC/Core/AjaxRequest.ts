/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export interface IAjaxRequestItem {
        Data: any;
        Method: string;
        Handler: (xhr: XMLHttpRequest) => void;
    }

    export interface IAjaxRequest {
        XHR: XMLHttpRequest;
        Updating: boolean;
        Send: (data: any, method: string, handler: (xhr: XMLHttpRequest) => void) => IAjaxRequest;
        Timestamp: Date;
    }

    export class AjaxRequestItemBase extends CoreObject implements IAjaxRequestItem {
        public constructor(private data?: any, private method?: string, private handler?: (xhr: XMLHttpRequest) => void) {
            super();
        }

        public get Data(): any {
            return this.data;
        }

        public get Method(): string {
            return this.method;
        }

        public get Handler(): (xhr: XMLHttpRequest) => void {
            return this.handler;
        }

        public equals(obj: IAjaxRequestItem): boolean {
            var equal: boolean = (
                (this.Data === obj.Data)
                && (this.Method === obj.Method)
                && (this.Handler === obj.Handler)
                );

            return equal;
        }
    }

    export class AjaxRequestItem extends AjaxRequestItemBase {
    }

    export class AjaxRequestBase extends CoreObject implements IAjaxRequest {
        private xhr: XMLHttpRequest;
        private updating: boolean;
        private timestamp: Date;
        private queue: ICollection<IAjaxRequestItem>;

        public constructor(private url: string) {
            super();

            this.updating = false;
            this.timestamp = new Date(Date.now());
            this.queue = new Collection<IAjaxRequestItem>();
        }

        private AddToQueue(data: any, method: string, handler: (xhr: XMLHttpRequest) => void): void {
            var item: IAjaxRequestItem = new AjaxRequestItem(data, method, handler);
            if (this.queue.IndexOf(item) < 0) {
                this.queue.Add(item);
            }
        }

        private TryXhr(xhr: XMLHttpRequest): void {
            if (!Args.IsNull(xhr)) {
                this.xhr = xhr;
            }
        }

        private EnsureXHR(): void {
            if (Args.IsNull(this.XHR)) {
                throw new InvalidOperationException("A valid XMLHttpRequest implementation cannot be found.");
            }
        }

        private EnsurePOSTData(data: any, method: string): void {
            if (!Args.IsNull(method)) {
                if (method.toLowerCase() === "post") {
                    if (!Args.IsNull(data) && typeof data !== "string") {
                        throw new ArgumentException("data", "The {0} argument must be of type 'String' for POST requests.");
                    }
                }
            }
        }

        private Start(): void {
            if (this.queue.Count > 0) {
                var next: IAjaxRequestItem = this.queue.Get(0);
                this.queue.Remove(next);
                this.ProcessRequest(next);
            }
        }

        private ProcessRequest(requestItem: IAjaxRequestItem): boolean {
            Args.IsNotNull(requestItem, "requestItem");

            var result: boolean = false,
                item: IAjaxRequestItem = requestItem;

            this.XHR.onreadystatechange = (ev: Event): any => {
                if (this.XHR.readyState === XMLHttpRequest.DONE) {
                    this.updating = false;
                    item.Handler(this.XHR);

                    this.Start();

                    this.XHR = null;
                }
            };

            this.timestamp = new Date(Date.now());

            var uri: string = this.url;
            if (/post/i.test(item.Method)) {
                uri += "?" + this.Timestamp.getTime();
                this.XHR.open("POST", uri, true);
                this.XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                this.XHR.setRequestHeader("Content-Length", item.Data.length.toString());
                this.XHR.send(item.Data);
                this.updating = true;
            } else {
                if (typeof item.Data === "string") {
                    uri += "?" + item.Data + "&timestamp=" + (this.timestamp.getTime());
                    this.XHR.open("GET", uri, true);
                    this.XHR.send(null);
                    this.updating = true;
                }
            }

            return result;
        }

        public Send(data: any, method: string, handler: (xhr: XMLHttpRequest) => void): IAjaxRequest {
            this.EnsureXHR();

            this.EnsurePOSTData(data, method);

            this.AddToQueue(data, method, handler);

            if (!this.updating) {
                this.Start();
            }

            return this;
        }

        public Abort(): void {
            this.updating = false;
            if (!Args.IsNull(this.xhr)) {
                this.xhr.abort();
                this.xhr = null;
            }
        }

        public get XHR(): XMLHttpRequest {
            if (Args.IsNull(this.xhr)) {
                if (!Args.IsNull(XMLHttpRequest)) {
                    this.xhr = new XMLHttpRequest();
                } else {
                    /**
                     * Microsoft.XMLHTTP
                     * Microsoft.XMLHTTP 1.0
                     * MSXML2.XMLHTTP
                     * MSXML2.XMLHTTP.3.0
                     */
                    this.TryXhr(new ActiveXObject("Microsoft.XMLHTTP"));
                    if (Args.IsNull(this.xhr)) {
                        this.TryXhr(new ActiveXObject("MSXML2.XMLHTTP"));
                        if (Args.IsNull(this.xhr)) {
                            this.TryXhr(new ActiveXObject("MSXML2.XMLHTTP.3.0"));
                        }
                    }
                }
            }

            return this.xhr;
        }

        public set XHR(xhr: XMLHttpRequest) {
            this.xhr = xhr;
        }

        public get Updating(): boolean {
            return this.updating;
        }

        public get Timestamp(): Date {
            return this.timestamp;
        }
    }

    export class AjaxRequest extends AjaxRequestBase {
    }
}