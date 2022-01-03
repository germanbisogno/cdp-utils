import { Metric } from "./metrics";

/**
 * Interface for storage operations
 */
export interface StorageOperations {
    save(data: Metric): Promise<void>;
    close(): Promise<void>;
}