import Protocol from "devtools-protocol";
import { Har } from "har-format";
import { config } from "./config/config";
import { StorageManager } from './storageManager';

export abstract class TraceOperations {
    protected _events: any[] = [];
    protected _storage: StorageManager;

    constructor() {
        this._storage = new StorageManager();
    }

    abstract stopTrace(): Promise<Protocol.Tracing.DataCollectedEvent[]
        | Protocol.Runtime.ConsoleAPICalledEvent[]
        | Protocol.Performance.GetMetricsResponse
        | Har>;

    abstract startTrace(): Promise<void> | Promise<Protocol.Performance.GetMetricsResponse>;
    abstract saveMetrics(): Promise<void>;
}