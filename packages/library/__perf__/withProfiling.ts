import { join } from "path";
import { writeFileSync } from "fs";
import { Session } from "node:inspector/promises";

const withProfiling = async (F: () => void, profileName: string) => {
  const id = profileName + Date.now();
  const session = new Session();
  session.connect();
  await session.post("Profiler.enable");
  await session.post("Profiler.start");

  F();

  const { profile } = await session.post("Profiler.stop");
  session.disconnect();

  // if it doesn't have the extension .cpuprofile then
  // chrome's profiler tool won't like it.
  // examine the profile:
  //   Navigate to chrome://inspect
  //   Click Open dedicated DevTools for Node
  //   Select the profiler tab
  //   Load your file
  writeFileSync(join(__dirname, `${id}.cpuprofile`), JSON.stringify(profile));
};

export default withProfiling;
