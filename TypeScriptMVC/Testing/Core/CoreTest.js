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

test("call Test", 2, function () {
    var core = new MVC.CoreObject();
    var core2 = core.call(core, "hello", "world");

    ok((core2 !== null && typeof core2 !== undefined), "core.call(core) did not return null.");
    ok(typeof core2 === "function", "core.call(core) returned a function.");
});

test("apply Test", 2, function () {
    var core = new MVC.CoreObject();
    var args = ["hello", "world"];
    var core2 = core.apply(core, args);

    ok((core2 !== null && typeof core2 !== undefined), "core.apply(core) did not return null.");
    ok(typeof core2 === "function", "core.apply(core) returned a function.");
});

test("bind Test", 2, function () {
    var core = new MVC.CoreObject();
    var args = ["hello", "world"];
    var core2 = core.bind(core2, "hello", "world");

    ok((core2 !== null && typeof core2 !== undefined), "core.bind(core) did not return null.");
    ok(typeof core2 === "function", "core.bind(core) returned a function.");
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