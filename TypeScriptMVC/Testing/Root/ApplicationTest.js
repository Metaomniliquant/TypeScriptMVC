/* tslint:disable */
/* jshint ignore:start */

/// <reference path="Testing/Framework/Framework.js" />

module("MVC.Application");

test("Default Application", 1, function () {
    var app = new Mock.MockApplication();
    MVC.Application.Run(app);

    location.hash = "Mock/Index";

    var elem = document.getElementById("qunit-fixture");

    var children = elem.children;

    ok(children);
});