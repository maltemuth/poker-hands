import valueFromString from "../../../../src/model/card/valueFromString.js";
import { Value } from "../../../../src/model/card/Card.js";

describe("reading values from strings", () => {
  test("valid values", () => {
    expect(valueFromString("J")).toEqual(Value.jack);
  });
  test("invalid suit", () => {
    expect(() => valueFromString("17")).toThrow();
  });
  test("read a 10", () => {
    expect(valueFromString("T")).toEqual(Value.ten);
  });
});
