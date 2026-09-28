import { parseCards } from "../src/utils/cardParser";
import { cards } from "@malte.muth/poker-hands";

describe("parseCards", () => {
  it("parses concatenated cards", () => {
    expect(parseCards("AhKd2c")).toEqual(cards("Ah", "Kd", "2c"));
  });

  it("parses cards separated by whitespace", () => {
    expect(parseCards("Ah Kd  2c")).toEqual(cards("Ah", "Kd", "2c"));
    expect(parseCards(" Ah\tKd ")).toEqual(cards("Ah", "Kd"));
  });

  it("parses an empty or blank input as no cards", () => {
    expect(parseCards("")).toEqual([]);
    expect(parseCards("  ")).toEqual([]);
  });

  it("rejects anything that is not a card", () => {
    expect(() => parseCards("AhXx")).toThrow();
    expect(() => parseCards("Ah, Kd")).toThrow();
  });
});
