/// <reference path="../Core/Core.ts" />

module MVC {
    "use strict";

    export interface IRequestContext extends IContext {
    }

    export class RequestContextBase extends ContextBase implements IRequestContext {
    }

    export class RequestContext extends RequestContextBase {
        private static instance: IRequestContext;
        private static location: Location;
        private static navigator: Navigator;
        public constructor(loc?: Location, nav?: Navigator) {
            super(loc, nav);

            RequestContext.location = loc;
            RequestContext.navigator = nav;
        }
        public static get Current(): IRequestContext {
            if (Args.IsNull(RequestContext.instance)) {
                RequestContext.instance =
                    new RequestContext(RequestContext.location,
                        RequestContext.navigator);
            }

            return RequestContext.instance;
        }
    }
}