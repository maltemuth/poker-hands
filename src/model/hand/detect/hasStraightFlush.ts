import { HandDetector } from "./HandDetector";
import { Value } from "../../card/Card";
import hasContiguousSubSetsOfLength5 from "../../card/hasContiguousSubSetsOfLength5";

/**
 * returns true if a straight flush is contained within the given cards
 * @param cards
 */
const hasStraightFlush: HandDetector = (cards) => {
  /**
   * an object with suits as keys where the corresponing value is the list of values of that suit in cards
   */
  const valuesBySuit: { [suit: string]: Value[] } = cards.reduce(
    (dict, card) => {
      const { suit, value } = card;

      dict[suit] = dict[suit] || [];
      dict[suit].push(value);

      return dict;
    },
    {}
  );

  // only if any flushes remain, we need to calculate further
  const candidates = (Object.values(valuesBySuit) as Value[][]).filter(
    (list) => list.length >= 5
  );

  if (candidates.length === 0) return false;

  // this will now give a list of straight flushes for each remaining suit
  const candidatesWithStraights = candidates.filter(
    hasContiguousSubSetsOfLength5
  );

  // and a list of straight flushes starting with an ace for each remaining suit
  const candidatesWithStraightsWhereAceHasBeenReplacedByOne = candidates
    .map((candidate) =>
      candidate.map((value) => (value === Value.ace ? 1 : value))
    )
    .filter(hasContiguousSubSetsOfLength5);

  return (
    candidatesWithStraights.length >= 1 ||
    candidatesWithStraightsWhereAceHasBeenReplacedByOne.length >= 1
  );
};

export default hasStraightFlush;
