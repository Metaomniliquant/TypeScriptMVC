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