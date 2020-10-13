import assert from "assert";
import apicalypse from "../src/index";

describe("multi", () => {
  it("should build a valid query", () => {
    const now = new Date().getTime();
    const test = apicalypse().multi([
      apicalypse()
        .query("games", "latest-games")
        .fields("name")
        .sort("created_at desc")
        .where(`created_at < ${now}`),
      apicalypse()
        .query("games", "coming-soon")
        .fields("name")
        .sort("created_at asc")
        .where(`created_at > ${now}`),
    ]);

    assert.deepStrictEqual(
      test.apicalypse,
      `query games "latest-games" { fields name;sort created_at desc;where created_at < ${now}; };query games "coming-soon" { fields name;sort created_at asc;where created_at > ${now}; };`
    );
  });
});
