import { parentPort, workerData } from "node:worker_threads";
import calculateOdds from "./calculateOdds";

/**
 * The calculations a worker can run, by kind
 */
const jobs = {
  odds: calculateOdds,
};

export type JobKind = keyof typeof jobs;
export type JobRequest<K extends JobKind> = Parameters<(typeof jobs)[K]>[0];
export type JobResult<K extends JobKind> = ReturnType<(typeof jobs)[K]>;

/**
 * What a worker is started with
 */
export interface WorkerJob<K extends JobKind = JobKind> {
  kind: K;
  request: JobRequest<K>;
}

/**
 * Message a worker sends back: the result, or why the calculation failed
 */
export type WorkerMessage =
  | { ok: true; data: JobResult<JobKind> }
  | { ok: false; message: string };

// Runs inside a worker thread (see runInWorker): calculate, report, exit
if (parentPort) {
  const { kind, request } = workerData as WorkerJob;
  const run = jobs[kind] as (request: unknown) => JobResult<JobKind>;

  let message: WorkerMessage;
  try {
    message = { ok: true, data: run(request) };
  } catch (error) {
    message = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
  parentPort.postMessage(message);
}
