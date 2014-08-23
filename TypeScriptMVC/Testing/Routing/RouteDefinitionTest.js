/* tslint:disable */
/* jshint ignore:start */

module("MVC.RouteDefinition");

test("Data Type Test", 3, function () {
    var data3 = new MVC.RouteDefinition("{controller}/{action}/{id}");
    var data = new MVC.RouteDefinition("{controller}/{action}/{id}");

    ok(data instanceof MVC.RouteDefinition, "Type system is working.");
    ok(data instanceof MVC.CoreObject, "RouteDefinition is instance of CoreObject.");
    ok(data instanceof Object, "RouteDefinition is instance of object.");
});

test("Parsing Test", 6, function () {
    var param = "{controller}/{action}/{id}";
    var data = new MVC.RouteDefinition(param);

    var urlTemplate = data.UrlTemplate;
    var routeData = data.RouteData;

    ok(QUnit.is("string", urlTemplate), "UrlTemplate is of type string.");
    ok(routeData instanceof MVC.RouteData, "RouteData is of type RouteData.");
    equal(urlTemplate, param, "UrlTemplate is equal to originally passed urlTemplate.");

    equal(routeData.Get(0), "{controller}", "First route value is {controller}.");
    equal(routeData.Get(1), "{action}", "Second route value is {action}.");
    equal(routeData.Get(2), "{id}", "Second route value is {id}.");
});

test("Match Test", 3, function () {
    var param = "{controller}/{action}/{id}";
    var data1 = new MVC.RouteDefinition(param);
    var data2 = new MVC.RouteDefinition(param);
    var data3 = new MVC.RouteDefinition("{controller}/{action}");
    var data4 = new MVC.RouteDefinition("{id}/{action}/{controller}");

    ok(data1.Match(data2.RouteData), "RouteDefinitions match if their resultant RouteData has the same count.");
    ok(!data1.Match(data3.RouteData), "RouteDefinitions do not match if their resultant RouteData has different counts.");
    ok(!data1.Match(data4.RouteData), "RouteDefinitions do not match if their resultant RouteData has different values.")
});