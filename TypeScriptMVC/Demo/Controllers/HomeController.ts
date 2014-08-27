/// <reference path="../../Core/Core.ts" />
/// <reference path="../DemoApplication.ts" />
/// <reference path="../../Controller.ts" />
/// <reference path="../ViewModels/NameDescriptionViewModel.ts" />

module Demo {
    "use strict";

    export class HomeController extends MVC.Controller {
        public IndexAction(): MVC.IActionResult {
            var viewModel: NameDescriptionViewModel = new NameDescriptionViewModel();
            viewModel.Name = "Index View";
            viewModel.Description = "Index View is the main view.";

            return this.View("Index", "Home", viewModel);
        }
    }
}