/// <reference path="Core.ts" />
/// <reference path="Browser.ts" />

module MVC {
    "use strict";

    export interface IContext extends IUnknown {
        Location: Location;
        Navigator: Navigator;
    }

    export class ContextBase extends CoreObject implements IContext {
        public constructor(private loc?: Location, private nav?: Navigator) {
            super();

            if (Args.IsNull(this.loc)) {
                this.loc = new DefaultLocation();
            }

            if (Args.IsNull(this.nav)) {
                this.nav = new DefaultNavigator();
            }
        }

        public get Location(): Location {
            return this.loc;
        }

        public get Navigator(): Navigator {
            return this.nav;
        }
    }
}