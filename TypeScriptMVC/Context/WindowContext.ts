/// <reference path="../Core/Core.ts" />

module MVC {
    "use strict";

    export interface IWindowContext extends IContext {
        Window: Window;
    }

    export class WindowContextBase extends ContextBase implements IWindowContext {
        public constructor(loc?: Location, nav?: Navigator, private win?: Window) {
            super(loc, nav);

            if (Args.IsNull(this.win)) {
                this.win = DefaultWindow.Get();
            }
        }

        public get Window(): Window {
            return this.win;
        }
    }

    export class WindowContext extends WindowContextBase {
    }
}