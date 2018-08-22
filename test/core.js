import assert from "assert";
import apicalypse from "../src/index";

describe("core", () => {
  it("should initiate with a default configuration", () => {
    const test = apicalypse();

    assert.equal(test.config.queryMethod, "body");
  });

  it("should initiate with an apicalypse query and config", () => {
    const query = `fields id;limit 50; offset 50;`;
    const test = apicalypse(query, { queryMethod: "url" });

    assert.equal(test.apicalypse, query);
    assert.equal(test.config.queryMethod, "url");
  });

  it("should safely put the apicalypse in the url", () => {
    const test = apicalypse({
      queryMethod: "url"
    })
      .limit(10)
      .constructOptions("/test1");

    assert.equal(test.params.apicalypse, "limit%2010%3B");
  });

  it("should put the apicalypse in the body", () => {
    const test = apicalypse({
      queryMethod: "body"
    })
      .limit(10)
      .constructOptions("/test1");

    assert.equal(test.data, "limit 10;");
  });
});
