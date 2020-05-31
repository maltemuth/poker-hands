import { HandDetector } from "./HandDetector";
import { Value } from "../../card/Card";
import hasContiguousSubSetsOfLength5 from "../../card/hasContiguousSubSetsOfLength5";
import hasFlush from "./hasFlush";
import hasStraight from "./hasStraight";

/**
 * returns true if a straight flush is contained within the given cards
 * @param cards
 */
const hasStraightFlush: HandDetector = (cards, _) => {
  if (!hasFlush(cards, _)) return false;
  if (!hasStraight(cards, _)) return false;

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

  const flushCandidate = candidates[0];

  if (hasContiguousSubSetsOfLength5(flushCandidate)) return true;

  // and a list of straight flushes starting with an ace for each remaining suit
  const candidateValuesWithAceReplaced = flushCandidate.map((value) =>
    value === Value.ace ? 1 : value
  );

  if (hasContiguousSubSetsOfLength5(candidateValuesWithAceReplaced))
    return true;

  return false;
};

export default hasStraightFlush;
