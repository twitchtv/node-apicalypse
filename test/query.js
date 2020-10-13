import assert from "assert";
import apicalypse from "../src/index";

describe("filter", () => {
  it("should add fields to filterArray", () => {
    const test = apicalypse().fields(["a", "b", "c"]);
    assert.deepStrictEqual(test.queryFields.fields, "fields a,b,c");

    test.fields(" x,y,z ");
    assert.deepStrictEqual(test.queryFields.fields, "fields x,y,z");
  });

  it("should add limit & offset to filterArray", () => {
    const test = apicalypse().limit(10).offset(10);

    assert.deepStrictEqual(test.queryFields.limit, "limit 10");
    assert.deepStrictEqual(test.queryFields.offset, "offset 10");
  });

  it("should add sort to filterArray", () => {
    const test = apicalypse().sort("name", "desc");
    assert.deepStrictEqual(test.queryFields.sort, "sort name desc");

    test.sort("name");
    assert.deepStrictEqual(test.queryFields.sort, "sort name asc");
  });

  it("should add search to filterArray", () => {
    const search = "It's always sunny in philadelphia";
    const test = apicalypse().search(search);

    assert.deepStrictEqual(test.queryFields.search, `search "${search}"`);
  });

  it("should add where to filterArray", () => {
    const test = apicalypse()
      .where(["a = 1", "b = 2", "c = 3"])
      .where("x = 1 & y = 2 & z = 3");

    assert(test.queryFields.where.includes(`where a = 1 & b = 2 & c = 3`));
    assert(test.queryFields.where.includes(`where x = 1 & y = 2 & z = 3`));
  });

  it("should not override the request body", () => {
    const test = apicalypse({
      data: "x",
    }).constructOptions("/");
    assert(test.data === "x");
  });

  it("should clean limit and offset", () => {
    const test = apicalypse().limit(1).offset(2);
    const values = test.cleanLimitOffset();
    assert.deepStrictEqual(test.queryFields.limit, undefined);
    assert.deepStrictEqual(test.queryFields.offset, undefined);
    assert.deepStrictEqual(values.limit, 1);
    assert.deepStrictEqual(values.offset, 2);
  });

  it("should handle an empty query", () => {
    const test = apicalypse().constructOptions();
    assert.deepStrictEqual(test.data, "");
  });
});
