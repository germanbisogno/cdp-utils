import { MemoryCounters } from "./memoryCounters";
import { Time } from "./time";
import { TraceSummary } from "./traceSummary";

// Union type for all metrics
export type Metric = TraceSummary & Time & MemoryCounters;
