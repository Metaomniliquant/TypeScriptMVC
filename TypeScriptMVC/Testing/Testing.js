///#source 1 1 /Testing/Core/CoreTest.js
/* tslint:disable */
/* jshint ignore:start */

module("MVC.CoreObject");

test("Constructor Test", 2, function () {
    var core = new MVC.CoreObject();

    ok(core instanceof Object, "core is instance of Object");
    ok(core instanceof MVC.CoreObject, "core is instance of MVC.CoreObject");
});

test("typeOf Test", 1, function () {
    var core = new MVC.CoreObject();

    equal(core.typeOf(), typeof core, "CoreObject.typeOf() returns result of typeof CoreObject");
});

test("toString Test", 1, function () {
    var core = new MVC.CoreObject();

    equal("", core.toString(), "CoreObject.toString() returns empty string");
});

test("getHashCode Test", 1, function () {
    var core = new MVC.CoreObject();

    equal(0, core.getHashCode(), "CoreObject.getHashCode() returns 0 for empty string");
});

test("equals Test", 1, function () {
    var core = new MVC.CoreObject();
    var core2 = new MVC.CoreObject();

    ok(core.equals(core2), "CoreObject.equals(CoreObject) returns true");
});

module("MVC.Exception>CoreObject");

test("toString Test", 1, function () {
    var ex = new MVC.Exception("Test Exception Message", new MVC.Exception("Test Inner Exception Message"));
    var str = ex.toString();

    ok(str && str.length > 0, "Exception.toString() returns {" + str + "}");
});

test("getHashCode Test", 1, function () {
    var ex = new MVC.Exception("Test Exception Message");

    var code = ex.getHashCode();

    ok(code > 0, "Exception.getHashCode() returns {" + code + "}");
});

test("equals Test", 2, function () {
    var ex1 = new MVC.Exception("Test Exception Message");
    var ex2 = new MVC.Exception("Test Exception Message Two");

    ok(!ex1.equals(ex2), "Exception1 should not equal Exception2 due to separate objects and messages.");
    ok(ex1.equals(ex1), "Exception1 should equal Exception1 due to the same object & message.");
});

module("MVC.Args");

test("IsNull Test", 4, function () {
    //null test
    ok(MVC.Args.IsNull(null));
    var i = null;
    ok(MVC.Args.IsNull(i));
    //undefined test
    ok(MVC.Args.IsNull(undefined));
    //initialized test
    ok(!MVC.Args.IsNull("isnotnulltest"));
});

test("IsNotNull Test", 3, function () {
    MVC.Args.IsNotNull("hello");

    ok(true, "IsNotNull('hello') returned just fine.");

    try {
        MVC.Args.IsNotNull(null);
    } catch (e) {
        ok(true, "IsNotNull(null) returned exception: {" + e.toString() + "}");

        try {
            MVC.Args.IsNotNull(undefined);
        } catch (x) {
            ok(true, "IsNotNull(undefined) returned exception: {" + e.toString() + "}");
        }
    }
});
///#source 1 1 /Testing/Core/ExceptionsTest.js
/* tslint:disable */
/* jshint ignore:start */

module("MVC.CoreException");

test("Constructor Test", 3, function () {
    var sEx = new MVC.CoreException();

    ok(QUnit.is("null", sEx.InnerException), "Default innerException is null.");
    equal("An exception has occured", sEx.Message, "Default message is set.");
    ok(sEx.StackTrace !== null, "Stacktrace default is set.");
});

test("Stacktrace Test", 1, function () {
    var sEx = new MVC.CoreException();

    var stackTrace = sEx.StackTrace.Trace;

    ok(stackTrace && stackTrace.length > 0, "StackTrace.Trace returns: {" + stackTrace + "}");
});

test("Message Test", 1, function () {
    var message = "System Exception Test Message";
    var sEx = new MVC.CoreException(message);

    equal(message, sEx.Message, "Specified message is received.");
});

test("InnerException Test", 1, function () {
    var sEx1 = new MVC.CoreException();
    var sEx2 = new MVC.CoreException(undefined, sEx1);

    equal(sEx1, sEx2.InnerException, "Specified innerException is received.");
});

module("MVC.ApplicationException");

test("Constructor Test", 3, function () {
    var sEx = new MVC.ApplicationException();

    ok(QUnit.is("null", sEx.InnerException), "Default innerException is null.");
    equal("An exception has occured", sEx.Message, "Default message is set.");
    ok(sEx.StackTrace !== null, "Stacktrace default is set.");
});

test("Stacktrace Test", 1, function () {
    var sEx = new MVC.ApplicationException();

    var stackTrace = sEx.StackTrace.Trace;

    ok(stackTrace && stackTrace.length > 0, "StackTrace.Trace returns: {" + stackTrace + "}");
});

test("Message Test", 1, function () {
    var message = "Application Exception Test Message";
    var sEx = new MVC.ApplicationException(message);

    equal(message, sEx.Message, "Specified message is received.");
});

test("InnerException Test", 1, function () {
    var sEx1 = new MVC.ApplicationException();
    var sEx2 = new MVC.ApplicationException(undefined, sEx1);

    equal(sEx1, sEx2.InnerException, "Specified innerException is received.");
});

module("MVC.ArgumentException");

test("Null Values Constructor Test", 3, function () {
    var sEx = new MVC.ArgumentException();

    ok(QUnit.is("null", sEx.InnerException), "Default innerException is null.");
    equal(sEx.Message, "An invalid argument was specified.", "Default message is set.");
    ok(sEx.StackTrace !== null, "Stacktrace default is set.");
});

test("Parameter Value Only Constructor Test", 3, function () {
    var param = "param1";
    var sEx = new MVC.ArgumentException(param);

    ok(QUnit.is("null", sEx.InnerException), "Default innerException is null.");
    equal(sEx.Message, "An invalid argument was specified. Please check the {0} parameter.".replace("{0}", param), "Default message is set.");
    ok(sEx.StackTrace !== null, "Stacktrace default is set.");
});

test("Parameter & Message Values Constructor Test", 3, function () {
    var param = "param1";
    var msg = "The {0} cannot be null.";
    var sEx = new MVC.ArgumentException(param, msg);

    ok(QUnit.is("null", sEx.InnerException), "Default innerException is null.");
    equal(sEx.Message, "The {0} cannot be null.".replace("{0}", param), "Default message is set.");
    ok(sEx.StackTrace !== null, "Stacktrace default is set.");
});

test("Message Value Only Constructor Test", 3, function () {
    var msg = "Value cannot be null.";
    var sEx = new MVC.ArgumentException(undefined, msg);

    ok(QUnit.is("null", sEx.InnerException), "Default innerException is null.");
    equal(sEx.Message, "Value cannot be null.", "Default message is set.");
    ok(sEx.StackTrace !== null, "Stacktrace default is set.");
});

module("MVC.ArgumentNullException");

test("Parameter Only Constructor Test", 3, function () {
    var ex = new MVC.ArgumentNullException("hello");

    ok(QUnit.is("null", ex.InnerException), "Default innerException is null.");
    equal(ex.Message, "The {0} argument cannot be null.".replace("{0}", "hello"), "Default message is set.");
    ok(ex.StackTrace !== null, "Stacktrace default is set.");
});

module("MVC.ArgumentOutOfRangeException");

test("Parameter Only Constructor Test", 3, function () {
    var ex = new MVC.ArgumentOutOfRangeException("hello");

    ok(QUnit.is("null", ex.InnerException), "Default innerException is null.");
    equal(ex.Message, "The {0} argument value is out of the allowed range.".replace("{0}", "hello"), "Default message is set.");
    ok(ex.StackTrace !== null, "Stacktrace default is set.");
});

module("MVC.NullReferenceException");

test("Default Constructor Test", 3, function () {
    var ex = new MVC.NullReferenceException();

    ok(QUnit.is("null", ex.InnerException), "Default innerException is null.");
    equal(ex.Message, "An object reference was not set to an instance of an object.", "Default message is set.");
    ok(ex.StackTrace !== null, "Stacktrace default is set.");
});

test("Message Value Constructor Test", 3, function () {
    var ex = new MVC.NullReferenceException("hello");

    ok(QUnit.is("null", ex.InnerException), "Default innerException is null.");
    equal(ex.Message, "hello", "Default message is set.");
    ok(ex.StackTrace !== null, "Stacktrace default is set.");
});
///#source 1 1 /Testing/Routing/RouteDataTest.js
/* tslint:disable */
/* jshint ignore:start */

module("MVC.RouteData");

test("Data Type Test", 4, function () {
    var data = new MVC.RouteData();

    ok(typeof data === "object", "RouteData is an object.");
    ok(typeof data === data.typeOf(), "RouteData.typeOf is equal to 'typeof RouteData'.");
    ok(data instanceof MVC.Collection, "RouteData is an instance of MVC.Collection.");
    ok(data instanceof MVC.CoreObject, "RouteData is an instance of MVC.CoreObject.");
});

test("Default Items Test", 2, function () {
    var data = new MVC.RouteData();

    var items = data.Items;

    ok(QUnit.is("array", items), "RouteData.Items is an array.");
    equal(0, items.length, "RouteData.Items defaults to empty list.");
});

test("Add Items Test", 4, function () {
    var data = new MVC.RouteData();

    var originalLength = data.Items.length;

    data.Add("hello");
    data.Add("world");

    var items = data.Items;

    equal(0, originalLength, "RouteData.Items defaults to empty list.");
    equal(2, items.length, "RouteData.Add called twice added two items.");
    equal(items[0], "hello", "RouteData.Items indexer zero matches added item's value.");
    equal(items[1], "world", "RouteData.Items indexer 1 matches added item's value.");
});

test("Get Test", 4, function () {
    var data = new MVC.RouteData();

    data.Add("hello");
    data.Add("world");

    var item1 = data.Get(0);
    var item2 = data.Get(1);

    ok(item1, "Get indexer zero is not null.");
    ok(item2, "Get indexer 1 is not null.");
    equal("hello", item1, "RouteData.Get(0) returned value of first item.");
    equal("world", item2, "RouteData.Get(1) returned value of second item.");
});

test("Get Negative Test", 1, function () {
    var data = new MVC.RouteData();

    data.Add("hello");

    try {
        var item1 = data.Get(1);
    } catch (e) {
        ok(e instanceof MVC.ArgumentOutOfRangeException, "Error is of type ArgumentOutOfRangeException: {" + e.toString() + "}");
    }
});

test("Count Test", 2, function () {
    var data = new MVC.RouteData();

    var count1 = data.Count;

    data.Add("hello");

    var count2 = data.Count;

    equal(0, count1, "RouteData original count is zero.");
    equal(1, count2, "RouteData count after adding a single item is 1.");
});

test("IndexOf Test", 3, function () {
    var data = new MVC.RouteData();

    var index1 = data.IndexOf("Hello");

    data.Add("hello");

    var index2 = data.IndexOf("Hello");
    var index3 = data.IndexOf("hello");

    equal(-1, index1, "RouteData.IndexOf returns -1 if item is not found.");
    equal(-1, index2, "RouteData.IndexOf returns -1 (== checks value).");
    equal(0, index3, "RouteData.IndexOf returns index of first item as zero.");
});

test("Remove Test", 4, function () {
    var data = new MVC.RouteData();

    data.Add("hello");
    data.Add("Hello");
    data.Add("hello");

    var count1 = data.Count;
    var indexOf_hello = data.IndexOf("hello");

    data.Remove("hello");

    var count2 = data.Count;
    var indexOf_hello2 = data.IndexOf("hello");

    equal(3, count1, "RouteData is correct after adding three items.");
    equal(0, indexOf_hello, "RouteData.IndexOf returns zero as first occurance of 'hello'.");
    equal(2, count2, "RouteData returns 2 items after removal.");
    equal(1, indexOf_hello2, "RouteData.IndexOf returns 1 as first occurance of 'hello'.");
});

module("MVC.RouteDataCollection");

test("Data Type Test", 4, function () {
    var data = new MVC.RouteDataCollection();

    ok(typeof data === "object", "RouteDataCollection is an object.");
    ok(typeof data === data.typeOf(), "RouteDataCollection.typeOf is equal to 'typeof RouteDataCollection'.");
    ok(data instanceof MVC.Collection, "RouteDataCollection is an instance of MVC.Collection.");
    ok(data instanceof MVC.CoreObject, "RouteDataCollection is an instance of MVC.CoreObject.");
});

test("Add Items Test", 4, function () {
    var data = new MVC.RouteDataCollection();

    var originalLength = data.Items.length;

    var item1 = new MVC.RouteData();
    var item2 = new MVC.RouteData();
    data.Add(item1);
    data.Add(item2);

    var items = data.Items;

    equal(0, originalLength, "RouteDataCollection.Items defaults to empty list.");
    equal(2, items.length, "RouteDataCollection.Add called twice added two items.");
    equal(items[0], item1, "RouteDataCollection.Items indexer zero matches added item's value.");
    equal(items[1], item2, "RouteDataCollection.Items indexer 1 matches added item's value.");
});
///#source 1 1 /Testing/Routing/RouteDefinitionTest.js
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
///#source 1 1 /Testing/Root/ApplicationTest.js
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
