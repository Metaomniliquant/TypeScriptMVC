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