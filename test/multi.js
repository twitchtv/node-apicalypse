import assert from "assert";
import apicalypse from "../src/index";

describe("multi", () => {
  it("should build a valid query", () => {
    const now = new Date().getTime();
    const test = apicalypse().multi([
      apicalypse()
        .query("games", "latest-games")
        .fields("name")
        .where(`created_at < ${now}`)
        .sort("created_at desc"),
      apicalypse()
        .query("games", "coming-soon")
        .fields("name")
        .where(`created_at > ${now}`)
        .sort("created_at asc")
    ]);

    assert(
      test.apicalypse ===
        `query games "latest-games" { fields name;where created_at < ${now};sort created_at desc; };query games "coming-soon" { fields name;where created_at > ${now};sort created_at asc; };`
    );
  });
});
