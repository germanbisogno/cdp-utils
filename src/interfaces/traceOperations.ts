export interface TraceOperations {
    startTrace(): Promise<void>;
    stopTrace(): Promise<any>;
}