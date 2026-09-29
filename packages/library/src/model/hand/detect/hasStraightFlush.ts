import { Value, Card } from "../../card/Card.js";
import hasContiguousSubSetsOfLength5 from "../../card/hasContiguousSubSetsOfLength5.js";
import hasFlush from "./hasFlush.js";
import hasStraight from "./hasStraight.js";
import sortedValues from "../../card/sortedValues.js";
import sortedSuits from "../../card/sortedSuits.js";

/**
 * returns true if a straight flush is contained within the given cards
 * @param cards
 */
const hasStraightFlush = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards),
  alreadyHasFlush = hasFlush(cards, presortedSuits),
  alreadyHasStraight = hasStraight(cards, presortedValues)
) => {
  if (!alreadyHasFlush) return false;
  if (!alreadyHasStraight) return false;

  /**
   * an object with suits as keys where the corresponing value is the list of values of that suit in cards
   */
  const valuesBySuit: { [suit: string]: Value[] } = cards.reduce(
    (dict: Record<string, Value[]>, card) => {
      const { suit, value } = card;

      dict[suit] = dict[suit] || [];
      dict[suit].push(value);

      return dict;
    },
    {} as Record<string, Value[]>
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
