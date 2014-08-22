/// <reference path="../Core/Core.ts" />

module MVC {
    "use strict";

    export interface IActionResult {
        ExecuteResult: (controllerContext: ControllerContext) => void;
    }
}