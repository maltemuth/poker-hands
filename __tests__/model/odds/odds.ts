import cards from "../../../src/model/card/cards";
import odds from "../../../src/model/odds/odds";

// tested against http://www.propokertools.com/simulations
describe("calculate odds", () => {
  test("equal value have equal win chance", () => {
    const results = odds([cards("HA", "SA"), cards("DA", "CA")]);

    expect(results[0].wins).toEqual(results[1].wins);
    expect(results[0].ties).toEqual(results[1].ties);
    expect(results[0].winChance).toBeCloseTo(0.0217);
    expect(results[0].tieChance).toBeCloseTo(0.9565);
  });

  test("pocket rockets versus double 10", () => {
    const results = odds([cards("HA", "SA"), cards("DT", "CT")]);

    expect(results[0].winChance).toBeCloseTo(0.8008);
    expect(results[1].winChance).toBeCloseTo(0.1992);
  });
});
