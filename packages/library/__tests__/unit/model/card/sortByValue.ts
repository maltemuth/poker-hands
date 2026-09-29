import sortByValue from "../../../../src/model/card/sortByValue.js";
import cards from "../../../../src/model/card/cards.js";
import toString from "../../../../src/model/card/toString.js";

describe("sort cards by value", () => {
  test("sorts from lowest to highest", () => {
    expect(sortByValue(cards("Kd", "2c", "Ah", "7s")).map(toString)).toEqual([
      "2c",
      "7s",
      "Kd",
      "Ah",
    ]);
  });

  test("leaves its input unchanged", () => {
    const input = cards("Kd", "2c", "Ah", "7s");
    sortByValue(input);
    expect(input.map(toString)).toEqual(["Kd", "2c", "Ah", "7s"]);
  });
});
