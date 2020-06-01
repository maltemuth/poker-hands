import odds from "../src/model/odds/odds";
import cards from "../src/model/card/cards";
import { writeFileSync } from "fs";

import * as profiler from "v8-profiler-next";
const id = Date.now() + ".profile";
profiler.startProfiling(id);
console.log(
  //   odds([cards("Ah", "As"), cards("Ad", "Ac")], cards("Th", "Tc", "Td"))
  //   odds([cards("Ah", "As"), cards("Td", "Tc")], cards("7c", "7d", "6s"))
  // odds([cards("Ac", "Ad"), cards("Td", "Tc")], cards("7s", "8h", "Th", "9s"))
  odds([cards("Ac", "Ad"), cards("Td", "Tc")])
  // odds([cards("Ac", "Kc"), cards("Td", "Tc"), cards("9d", "7h")])
  // odds([cards("Ac", "Ad"), cards("Td", "Tc")], [])
  //   odds([cards("Ah", "As"), cards("Td", "Tc")])
);

// start profiling

const profile = profiler.stopProfiling(id);
profile.export(function (error, result) {
  // if it doesn't have the extension .cpuprofile then
  // chrome's profiler tool won't like it.
  // examine the profile:
  //   Navigate to chrome://inspect
  //   Click Open dedicated DevTools for Node
  //   Select the profiler tab
  //   Load your file
  writeFileSync(__dirname + `/${id}.cpuprofile`, result);
  profile.delete();
});
