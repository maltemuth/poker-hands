import exhaustive from "../src/model/odds/exhaustive";
import cards from "../src/model/card/cards";
import withProfiling from "./withProfiling";

withProfiling(
  () =>
    console.log(
      //   odds([cards("Ah", "As"), cards("Ad", "Ac")], cards("Th", "Tc", "Td"))
      //   odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7c", "7d", "6s"))
      // odds([cards("Ac", "Ad"), cards("Td", "Tc")], cards("7s", "8h", "Th", "9s"))
      exhaustive([cards("Ac", "Ad"), cards("Td", "Tc")])
      // odds([cards("Ac", "Kc"), cards("Td", "Tc"), cards("9d", "7h")])
      // odds([cards("Ac", "Ad"), cards("Td", "Tc")], [])
      //   odds([cards("Ah", "As"), cards("Td", "Tc")])
    ),
  "odds"
);
