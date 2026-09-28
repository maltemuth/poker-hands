import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { OddsData, OddsRequest } from "../types";
import type { WorkerMessage } from "./worker";

/**
 * The library rejected the request, e.g. because a card is used twice.
 */
export class CalculationError extends Error {}

// Compiled, the worker is worker.js next to this file. Run from the sources
// (npm run dev, tests), it is worker.ts and needs tsx to load TypeScript.
const fromSources = __filename.endsWith(".ts");
const workerFile = join(__dirname, fromSources ? "worker.ts" : "worker.js");
const execArgv = fromSources ? ["--import", "tsx"] : [];

/**
 * Calculates the odds for a validated request in a worker thread, so that
 * long calculations don't block the service's event loop.
 *
 * The promise settles once the worker has exited, so a caller holding a
 * concurrency slot until then never has more workers running than slots.
 *
 * @throws {CalculationError} If the library rejects the request
 */
export const runInWorker = (request: OddsRequest): Promise<OddsData> =>
  new Promise((resolve, reject) => {
    const worker = new Worker(workerFile, { workerData: request, execArgv });

    let message: WorkerMessage | undefined;
    let failure: Error | undefined;
    worker.once("message", (received: WorkerMessage) => (message = received));
    worker.once("error", (error) => (failure = error));

    worker.once("exit", (code) => {
      if (message?.ok) {
        resolve(message.data);
      } else if (message) {
        reject(new CalculationError(message.message));
      } else {
        reject(failure ?? new Error(`Odds worker exited with code ${code}`));
      }
    });
  });
