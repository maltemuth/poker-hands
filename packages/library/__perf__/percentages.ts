import cards from "../src/model/card/cards.js";
import percentages from "../src/model/odds/percentages.js";
import withProfiling from "./withProfiling.js";

withProfiling(
  () =>
    console.log(
      //   odds([cards("Ah", "As"), cards("Ad", "Ac")], cards("Th", "Tc", "Td"))
      //   odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7c", "7d", "6s"))
      // odds([cards("Ac", "Ad"), cards("Td", "Tc")], cards("7s", "8h", "Th", "9s"))
      percentages(cards("Ac", "Ad"))
      // odds([cards("Ac", "Kc"), cards("Td", "Tc"), cards("9d", "7h")])
      // odds([cards("Ac", "Ad"), cards("Td", "Tc")], [])
      //   odds([cards("Ah", "As"), cards("Td", "Tc")])
    ),
  "percentages"
);
