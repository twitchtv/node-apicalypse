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

  it("should add order to filterArray", () => {
    const test = apicalypse()
      .order("name", "desc")
      .order("name");

    assert(test.filterArray.includes("order name desc"));
    assert(test.filterArray.includes("order name asc"));
  });

  it("should add search to filterArray", () => {
    const search = "It's always sunny in philadelphia";
    const test = apicalypse().search(search);

    assert(test.filterArray.includes(`search ${search}`));
  });

  it("should add filter to filterArray", () => {
    const test = apicalypse()
      .filter(["a = 1", "b = 2", "c = 3"])
      .filter("x = 1 & y = 2 & z = 3");

    assert(test.filterArray.includes(`filter a = 1 & b = 2 & c = 3`));
    assert(test.filterArray.includes(`filter x = 1 & y = 2 & z = 3`));
  });
});
