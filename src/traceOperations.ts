import Protocol from "devtools-protocol";
import { Har } from "har-format";

export abstract class TraceOperations {
    abstract startTrace(): Promise<void> | Promise<Protocol.Performance.GetMetricsResponse>;
    abstract stopTrace(): Promise<Protocol.Runtime.ConsoleAPICalledEvent[]>
        | Promise<Protocol.Performance.GetMetricsResponse>
        | Promise<Protocol.Tracing.DataCollectedEvent[]>
        | Promise<Har | undefined>;
}