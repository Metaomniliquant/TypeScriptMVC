/// <reference path="../../Controller.ts" />

module Mock {
    "use strict";

    export class MockController extends MVC.Controller {
        public constructor() {
            super("MockController", "MockApplication");
        }

        public IndexAction(): MVC.IActionResult {

            this.ViewData.Add("ViewDataKey", "View Data Key");

            var htmlStr: string = "<div data-bind='text: name'></div>"
                + "<div data-bind='text: count'></div>"
                + "<div data-bind='text: names'></div>"
                + "<div data-bind='text: ViewData[0]'></div>";

            var view: MVC.IView = new MockView(htmlStr);
            var viewModel: MVC.IViewModel = new MockViewModel(view, {
                name: "First Name",
                count: 10,
                names: ["John Doe", "Jane Doe"]
            });

            return this.View(viewModel);
        }
    }
}