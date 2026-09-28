import {
  SUIT_INDEX,
  addCard,
  createHandState,
  rankOf,
  removeCard,
} from "../../../../src/model/hand/handState";
import evaluate from "../../../../src/model/hand/evaluate";
import cards from "../../../../src/model/card/cards";
import { Card } from "../../../../src/model/card/Card";

const add = (state: ReturnType<typeof createHandState>, input: Card[]) =>
  input.forEach((card) => addCard(state, SUIT_INDEX[card.suit], card.value));

describe("hand state", () => {
  test("ranks the cards added to it like evaluate", () => {
    const state = createHandState();
    add(state, cards("Kh", "Kd", "Ks", "9c", "9d", "2s", "4h"));
    expect(rankOf(state)).toBe(0x7ddd99);
  });

  test("removing cards undoes adding them", () => {
    const state = createHandState();
    const board = cards("Ah", "Kh", "Qh", "Jh", "2c");

    add(state, board);
    add(state, cards("Th", "3d"));
    expect(rankOf(state)).toBe(evaluate([...board, ...cards("Th", "3d")]));

    removeCard(state, SUIT_INDEX.h, 10);
    removeCard(state, SUIT_INDEX.d, 3);
    add(state, cards("Kc", "Kd"));
    expect(rankOf(state)).toBe(evaluate([...board, ...cards("Kc", "Kd")]));
  });
});
