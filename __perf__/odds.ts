import odds from "../src/model/odds/odds";
import cards from "../src/model/card/cards";
import { writeFileSync } from "fs";

import * as profiler from "v8-profiler-next";
const id = Date.now() + ".profile";
profiler.startProfiling(id);
console.log(
  //   odds([cards("HA", "SA"), cards("DA", "CA")], cards("HT", "CT", "DT"))
  //   odds([cards("HA", "SA"), cards("DT", "CT")], cards("C7", "D7", "S6"))
  // odds([cards("CA", "DA"), cards("DT", "CT")], cards("S7", "H8", "HT", "S9"))
  // odds([cards("CA", "CK"), cards("DT", "CT")])
  odds([cards("CA", "CK"), cards("DT", "CT"), cards("D9", "H7")])
  // odds([cards("CA", "DA"), cards("DT", "CT")], [])
  //   odds([cards("HA", "SA"), cards("DT", "CT")])
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
