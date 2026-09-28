import { parentPort, workerData } from "node:worker_threads";
import calculateOdds from "./calculateOdds";
import { OddsData, OddsRequest } from "../types";

/**
 * Message a worker sends back: the result, or why the calculation failed
 */
export type WorkerMessage =
  | { ok: true; data: OddsData }
  | { ok: false; message: string };

// Runs inside a worker thread (see runInWorker): calculate, report, exit
if (parentPort) {
  let message: WorkerMessage;
  try {
    message = { ok: true, data: calculateOdds(workerData as OddsRequest) };
  } catch (error) {
    message = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
  parentPort.postMessage(message);
}
