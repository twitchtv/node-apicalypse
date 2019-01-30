import assert from "assert";
import apicalypse from "../src/index";

describe("multi", () => {
  it("should build a valid query", () => {
    const test = apicalypse().multi([
      {
        endpoint: "games",
        name: "Latest Games",
        query: apicalypse
      }
    ]);

    assert(test.filterArray.includes("fields a,b,c"));
    assert(test.filterArray.includes("fields x,y,z"));
  });
});
