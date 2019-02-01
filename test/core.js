import assert from "assert";
import apicalypse from "../src/index";

describe("core", () => {
  it("should initiate with a default configuration", () => {
    const test = apicalypse();

    assert.equal(test.config.queryMethod, "body");
  });

  it("should initiate with an apicalypse filter and config", () => {
    const filter = `fields id;limit 50; offset 50;`;
    const test = apicalypse(filter, { queryMethod: "url" });

    assert.equal(test.apicalypse, filter);
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

  it("should reset the instance on request", () => {
    const instance = apicalypse();

    instance.limit(10).constructOptions("/test1");
    const opts = instance.offset(10).constructOptions("/test1");
    assert.equal(instance.filterArray.length, 0);
    assert.equal(opts.data, "offset 10;");

    instance.limit(5);
    assert.equal(instance.filterArray.length, 1);
  });
});
