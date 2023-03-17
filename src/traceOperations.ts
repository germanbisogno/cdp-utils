import Protocol from 'devtools-protocol';
import { Har } from 'har-format';
import { FlowResult } from 'lighthouse';

export abstract class TraceOperations {
  abstract startTrace(
    stepName?: string
  ): Promise<void> | Promise<Protocol.Performance.GetMetricsResponse>;
  abstract stopTrace():
    | Promise<void>
    | Promise<Protocol.Runtime.ConsoleAPICalledEvent[]>
    | Promise<Protocol.Performance.GetMetricsResponse>
    | Promise<Protocol.Tracing.DataCollectedEvent[]>
    | Promise<FlowResult.Step[]>
    | Promise<Har>;
}
