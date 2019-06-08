import assert from "assert";
import apicalypse from "../src/index";

describe("filter", () => {
  it("should add fields to filterArray", () => {
    const test = apicalypse()
      .fields(["a", "b", "c"])
      .fields(" x,y,z ");

    assert(test.filterArray.includes("fields a,b,c"));
    assert(test.filterArray.includes("fields x,y,z"));
  });

  it("should add limit & offset to filterArray", () => {
    const test = apicalypse()
      .limit(10)
      .offset(10);

    assert(test.filterArray.includes("limit 10"));
    assert(test.filterArray.includes("offset 10"));
  });

  it("should add sort to filterArray", () => {
    const test = apicalypse()
      .sort("name", "desc")
      .sort("name");

    assert(test.filterArray.includes("sort name desc"));
    assert(test.filterArray.includes("sort name asc"));
  });

  it("should add search to filterArray", () => {
    const search = "It's always sunny in philadelphia";
    const test = apicalypse().search(search);

    assert(test.filterArray.includes(`search "${search}"`));
  });

  it("should add where to filterArray", () => {
    const test = apicalypse()
      .where(["a = 1", "b = 2", "c = 3"])
      .where("x = 1 & y = 2 & z = 3");

    assert(test.filterArray.includes(`where a = 1 & b = 2 & c = 3`));
    assert(test.filterArray.includes(`where x = 1 & y = 2 & z = 3`));
  });

  it("should not override the request body", () => {
    const test = apicalypse({
      data: "x"
    }).constructOptions("/");
    assert(test.data === "x");
  });

  it("should clean limit and offset", () => {
    const test = apicalypse()
      .limit(1)
      .offset(2);
    const values = test.cleanLimitOffset();
    assert(test.filterArray.length === 0);
    assert(values.limit === 1);
    assert(values.offset === 2);
  });

  it("should handle an empty query", () => {
    const test = apicalypse()
      .constructOptions();
    assert.equal(test.data, "");
  });
});
