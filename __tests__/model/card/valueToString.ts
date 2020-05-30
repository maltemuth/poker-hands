import valueToString from "../../../src/model/card/valueToString";
import { Value } from "../../../src/model/card/Card";

describe("convert card values to strings", () => {
  test("valid value", () => {
    expect(valueToString(Value.jack)).toEqual("J");
  });

  test("valid number value", () => {
    expect(valueToString(Value.two)).toEqual("2");
  });

  test("ace value", () => {
    expect(valueToString(Value.ace)).toEqual("A");
  });
});
