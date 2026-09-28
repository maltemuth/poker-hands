import { join } from "node:path";
import { Worker } from "node:worker_threads";
import type {
  JobKind,
  JobRequest,
  JobResult,
  WorkerJob,
  WorkerMessage,
} from "./worker";

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
 * Runs a calculation for a validated request in a worker thread, so that
 * long calculations don't block the service's event loop.
 *
 * The promise settles once the worker has exited, so a caller holding a
 * concurrency slot until then never has more workers running than slots.
 *
 * @throws {CalculationError} If the library rejects the request
 */
export const runInWorker = <K extends JobKind>(
  kind: K,
  request: JobRequest<K>
): Promise<JobResult<K>> =>
  new Promise((resolve, reject) => {
    const job: WorkerJob<K> = { kind, request };
    const worker = new Worker(workerFile, { workerData: job, execArgv });

    let message: WorkerMessage | undefined;
    let failure: Error | undefined;
    worker.once("message", (received: WorkerMessage) => (message = received));
    worker.once("error", (error) => (failure = error));

    worker.once("exit", (code) => {
      if (message?.ok) {
        resolve(message.data as JobResult<K>);
      } else if (message) {
        reject(new CalculationError(message.message));
      } else {
        reject(failure ?? new Error(`Worker exited with code ${code}`));
      }
    });
  });
