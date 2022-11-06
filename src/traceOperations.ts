import Protocol from 'devtools-protocol';
import { Har } from 'har-format';
import { RunnerResult } from 'lighthouse/types/externs';

export abstract class TraceOperations {
  abstract startTrace(
    stepName?: string
  ): Promise<void> | Promise<Protocol.Performance.GetMetricsResponse>;
  abstract stopTrace():
    | Promise<void>
    | Promise<Protocol.Runtime.ConsoleAPICalledEvent[]>
    | Promise<Protocol.Performance.GetMetricsResponse>
    | Promise<Protocol.Tracing.DataCollectedEvent[]>
    | Promise<RunnerResult[]>
    | Promise<Har>;
}
