describe("Non-standard Array functions", function () {
  var arr;

  beforeEach(function () {
    arr = ["zero", 1, "two", 3, "four"];
  });

  it("last", function () {
    expect(arr.last()).toEqual("four");
  });

  it("cycle", function () {
    expect(arr.cycle()).toEqual("zero");
    expect(arr).toEqual([1, "two", 3, "four", "zero"]);
  });
});

describe("DOM element additions", function () {
  var el;
  beforeEach(function () {
    el = document.createElement("div");
    el.className = "one two three four five";
  });

  it("should return a array of element classes", function () {
    expect(domExt.classArray(el)).toEqual(["one", "two", "three", "four", "five"]);
  });

  it("should properly find a class name", function () {
    expect(domExt.hasClass(el, "three")).toBeTruthy();
    expect(domExt.hasClass(el, "nothing")).toBeFalsy();
  });

  it("should be able to add classes", function () {
    domExt.addClass(el, "newClass");
    expect(el.className).toEqual("one two three four five newClass");
  });

  it("should be able to remove classes", function () {
    domExt.removeClass(el, "three");
    expect(el.className).toEqual("one two four five");
  });

});

describe("Object extensions", function () {
  it("merge", function () {
    var obj1 = {one: 1, two: 2, three: 3},
        obj2 = {three: 6, four: 4, five: 5};

    expect(Object.merge(obj2, obj1)).toEqual({one: 1, two: 2, three: 6, four: 4, five: 5})
  });
});
