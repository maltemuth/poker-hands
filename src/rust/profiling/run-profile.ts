import { startProfiling, stopProfiling } from "v8-profiler-next";
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from "fs";
import { performance } from "perf_hooks";
import { Hand, Card, Suit, Value } from "../node/poker_hands";

// Helper functions for parsing test data
const lineSuitToSuit = (lineSuit: string): Suit => {
  if (lineSuit === "1") return "h";
  if (lineSuit === "2") return "s";
  if (lineSuit === "3") return "d";
  if (lineSuit === "4") return "c";
  throw new Error("Invalid suit: " + lineSuit);
};

const lineValueToValue = (lineValue: string): Value => {
  if (lineValue === "1") return Value.Ace;
  if (lineValue === "2") return Value.Two;
  if (lineValue === "3") return Value.Three;
  if (lineValue === "4") return Value.Four;
  if (lineValue === "5") return Value.Five;
  if (lineValue === "6") return Value.Six;
  if (lineValue === "7") return Value.Seven;
  if (lineValue === "8") return Value.Eight;
  if (lineValue === "9") return Value.Nine;
  if (lineValue === "10") return Value.Ten;
  if (lineValue === "11") return Value.Jack;
  if (lineValue === "12") return Value.Queen;
  if (lineValue === "13") return Value.King;
  throw new Error("Invalid value: " + lineValue);
};

// Load training data from the test file
const loadTrainingData = (limit: number = 10000) => {
  // Adjust path to find the test data file
  const testDataPath = "../../../__tests__/full/poker-hand-testing.data";
  const trainingDataRaw = readFileSync(__dirname + "/" + testDataPath);

  const trainingLines = trainingDataRaw
    .toString()
    .split("\r\n")
    .map((line) => line.split(","))
    .map((line) => {
      const [
        suitOne,
        valueOne,
        suitTwo,
        valueTwo,
        suitThree,
        valueThree,
        suitFour,
        valueFour,
        suitFive,
        valueFive,
      ] = line;

      const cards = [
        [suitOne, valueOne],
        [suitTwo, valueTwo],
        [suitThree, valueThree],
        [suitFour, valueFour],
        [suitFive, valueFive],
      ].map(([lineSuit, lineValue]) =>
        Card.new(lineSuitToSuit(lineSuit), lineValueToValue(lineValue))
      );

      return { cards };
    })
    .slice(0, limit);

  return trainingLines;
};

// Clean existing CPU profiles
const cleanProfiles = () => {
  console.log("Cleaning existing CPU profiles...");
  const files = readdirSync(__dirname).filter(
    (file: string) =>
      file.startsWith("wasm-cpu-profile-") && file.endsWith(".cpuprofile")
  );

  files.forEach((file: string) => {
    unlinkSync(__dirname + "/" + file);
    console.log(`Deleted ${file}`);
  });

  console.log(`Cleaned ${files.length} profile(s)`);
};

// Analyze profile data
const analyzeProfile = (profileContent: any, filename: string) => {
  console.log(`Analyzing profile: ${filename}`);
  console.log("=".repeat(50));

  // This profile format uses samples and timestamps
  console.log(
    "Profile duration (ms):",
    profileContent.endTime - profileContent.startTime
  );
  console.log("Number of samples:", profileContent.samples.length);

  // Count occurrences of each node ID in samples
  const sampleCounts = new Map<number, number>();
  profileContent.samples.forEach((nodeId: number) => {
    sampleCounts.set(nodeId, (sampleCounts.get(nodeId) || 0) + 1);
  });

  // Sort by count
  const sortedSamples = Array.from(sampleCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  console.log("\nTop 20 most frequent node IDs:");
  console.log("-".repeat(30));
  sortedSamples.slice(0, 20).forEach(([nodeId, count]) => {
    console.log(`Node ID ${nodeId}: ${count} samples`);
  });

  // Try to find the node information
  if (profileContent.head) {
    console.log("\nHead node information:");
    console.log("-".repeat(30));
    console.log(JSON.stringify(profileContent.head, null, 2));
  } else {
    console.log("\nNo head node information found");
  }

  // Summary
  console.log("\nSummary:");
  console.log("-".repeat(30));
  console.log(`Total samples: ${profileContent.samples.length}`);
  console.log(`Unique node IDs: ${sampleCounts.size}`);
  console.log(
    `Profile duration: ${(
      (profileContent.endTime - profileContent.startTime) /
      1000
    ).toFixed(2)}s`
  );
  console.log(
    `Average samples per second: ${(
      profileContent.samples.length /
      ((profileContent.endTime - profileContent.startTime) / 1000)
    ).toFixed(0)}`
  );

  // Examine profile structure
  console.log("\nProfile structure examination:");
  console.log("-".repeat(30));
  console.log("Profile keys:", Object.keys(profileContent));

  if (profileContent.nodes) {
    console.log("Number of nodes:", profileContent.nodes.length);

    // Show first few nodes
    console.log("\nFirst 3 nodes:");
    for (let i = 0; i < Math.min(3, profileContent.nodes.length); i++) {
      const node = profileContent.nodes[i];
      console.log(
        `Node ${i}:`,
        JSON.stringify(
          {
            id: node.id,
            functionName: node.callFrame?.functionName,
            url: node.callFrame?.url,
            lineNumber: node.callFrame?.lineNumber,
            hitCount: node.hitCount,
            children: node.children ? node.children.length : 0,
          },
          null,
          2
        )
      );
    }
  }

  if (profileContent.samples) {
    console.log("Number of samples:", profileContent.samples.length);
    console.log("First 10 samples:", profileContent.samples.slice(0, 10));
  }

  if (profileContent.timeDeltas) {
    console.log("Number of time deltas:", profileContent.timeDeltas.length);
    console.log(
      "First 10 time deltas:",
      profileContent.timeDeltas.slice(0, 10)
    );
  }
};

// Main profiling function
const runCPUProfiling = (numLines: number) => {
  console.log(`Starting CPU profiling with ${numLines} lines...`);

  // Clean existing profiles
  cleanProfiles();

  // Start CPU profiling
  const profileName = "wasm-cpu-profile";

  // Load test data
  const trainingData = loadTrainingData(numLines);
  console.log(`Loaded ${trainingData.length} training lines.`);

  // Run the test with timing
  startProfiling(profileName);
  const before = performance.now();

  trainingData.forEach(({ cards }) => {
    Hand.new(cards).get_best_hand();
  });

  const elapsed = performance.now() - before;
  console.log(
    `${trainingData.length} hands / ${elapsed.toFixed(2)} ms / ${(
      (trainingData.length / elapsed) *
      1000
    ).toFixed(0)} hands/sec`
  );

  // Stop profiling and save
  const profile = stopProfiling(profileName);
  profile.export((error, result) => {
    if (error || !result) {
      console.error("Error exporting profile:", error);
      return;
    }

    // Save the profile
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `wasm-cpu-profile-${timestamp}.cpuprofile`;
    writeFileSync(__dirname + "/" + filename, result);
    console.log(`Profile saved to ${filename}`);

    // Analyze the profile
    const profileContent = JSON.parse(result);
    analyzeProfile(profileContent, filename);

    profile.delete();
  });
};

// Get number of lines from command line arguments
const numLines =
  process.argv.length > 2 ? parseInt(process.argv[2], 10) : 100000;

// Validate input
if (isNaN(numLines) || numLines <= 0) {
  console.error("Please provide a valid positive number of lines to process");
  process.exit(1);
}

// Run the profiling
runCPUProfiling(numLines);
