import { basename } from "path";
import { writeFileSync } from "fs";
import { startProfiling, stopProfiling } from "v8-profiler-next";

const withProfiling = (F: () => void, profileName: string) => {
  const id = profileName + Date.now();
  startProfiling(id);

  F();

  const profile = stopProfiling(id);
  profile.export(function (error, result) {
    // if it doesn't have the extension .cpuprofile then
    // chrome's profiler tool won't like it.
    // examine the profile:
    //   Navigate to chrome://inspect
    //   Click Open dedicated DevTools for Node
    //   Select the profiler tab
    //   Load your file
    writeFileSync(__dirname + `/${id}.cpuprofile`, result!);
    profile.delete();
  });
};

export default withProfiling;
