import valueFromString from "../../../src/model/card/valueFromString";
import { Value } from "../../../src/model/card/Card";

describe("reading values from strings", () => {
  test("valid values", () => {
    expect(valueFromString("J")).toEqual(Value.jack);
  });
  test("invalid suit", () => {
    expect(() => valueFromString("17")).toThrowError();
  });
  test("read a 10", () => {
    expect(valueFromString("T")).toEqual(Value.ten);
  });
});
