import { Card } from "../../../src/model/card/Card";
import fromString from "../../../src/model/card/fromString";
import hasPair from "../../../src/model/hand/detect/hasPair";
import getPair from "../../../src/model/hand/get/getPair";

// Create some cards
const cards = [
  fromString("2h"),
  fromString("2d"),
  fromString("3c"),
  fromString("4s"),
  fromString("5h"),
];

// Check if there's a pair
console.log("Has pair:", hasPair(cards));

// Get the pair
const pair = getPair(cards);
if (pair) {
  console.log(
    "Pair cards:",
    pair.cards().map((card) => card.toString())
  );
  console.log("Pair value:", pair.value().toString());
} else {
  console.log("No pair found");
}
