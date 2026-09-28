import { Card } from "../card/Card";
import { HandState, SUIT_INDEX, addCard, removeCard } from "../hand/handState";

/**
 * Completes the board in a hand state in every possible way: adds each
 * combination of `missing` cards from `rest` to the state, calls `visit`
 * with the complete board in the state, and removes the cards again. No
 * boards are built, and a card shared by many boards is added only once.
 * Afterwards, the state is as it was before.
 *
 * @param state - The hand state holding the known cards
 * @param rest - The cards the board can be completed with
 * @param missing - How many cards the board is missing
 * @param visit - Called once for each complete board
 */
const forEachBoard = (
  state: HandState,
  rest: Card[],
  missing: number,
  visit: () => void
): void => {
  // suit indices and values, looked up once instead of for every board
  const restSuits = rest.map((card) => SUIT_INDEX[card.suit]);
  const restValues = rest.map((card) => card.value);

  // adds the missing cards in every combination, from rest[start] on
  const completeBoard = (start: number, missingCards: number) => {
    if (missingCards === 0) {
      visit();
      return;
    }
    for (let i = start; i <= rest.length - missingCards; i++) {
      addCard(state, restSuits[i], restValues[i]);
      completeBoard(i + 1, missingCards - 1);
      removeCard(state, restSuits[i], restValues[i]);
    }
  };

  completeBoard(0, missing);
};

export default forEachBoard;
