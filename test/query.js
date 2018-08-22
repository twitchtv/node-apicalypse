import assert from "assert";
import apicalypse from "../src/index";

describe("query", () => {
  it("should add fields to queryArray", () => {
    const test = apicalypse()
      .fields(["a", "b", "c"])
      .fields(" x,y,z ");

    assert(test.queryArray.includes("fields a,b,c"));
    assert(test.queryArray.includes("fields x,y,z"));
  });

  it("should add limit & offset to queryArray", () => {
    const test = apicalypse()
      .limit(10)
      .offset(10);

    assert(test.queryArray.includes("limit 10"));
    assert(test.queryArray.includes("offset 10"));
  });

  it("should add order to queryArray", () => {
    const test = apicalypse()
      .order("name", "desc")
      .order("name");

    assert(test.queryArray.includes("order name:desc"));
    assert(test.queryArray.includes("order name:asc"));
  });

  it("should add search to queryArray", () => {
    const search = "It's always sunny in philadelphia";
    const test = apicalypse().search(search);

    assert(test.queryArray.includes(`search ${search}`));
  });

  it("should add query to queryArray", () => {
    const test = apicalypse()
      .query(["a = 1", "b = 2", "c = 3"])
      .query("x = 1 & y = 2 & z = 3");

    assert(test.queryArray.includes(`query a = 1 & b = 2 & c = 3`));
    assert(test.queryArray.includes(`query x = 1 & y = 2 & z = 3`));
  });
});
