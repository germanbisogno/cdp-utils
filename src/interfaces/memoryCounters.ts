import { Time } from "./time";

export interface MemoryCounters {
    jsHeapSizeUsed: Time,
    documents: Time,
    nodes: Time,
    jsEventListeners: Time,
    gpuMemoryUsedKB: Time
}