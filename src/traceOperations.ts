import Protocol from "devtools-protocol";

export abstract class TraceOperations {
    abstract startTrace(): Promise<void>;
    abstract stopTrace(): Promise<Protocol.Runtime.ConsoleAPICalledEvent[]> 
                        | Promise<Protocol.Performance.GetMetricsResponse>
                        | Promise<Protocol.Tracing.DataCollectedEvent[]>;
}