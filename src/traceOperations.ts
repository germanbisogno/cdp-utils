export abstract class TraceOperations {
    abstract startTrace(): Promise<void>;
    abstract stopTrace(): Promise<any>;
}