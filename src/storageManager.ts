import { Metric } from "./interfaces/metrics";
import { StorageOperations } from "./interfaces/storageOperations";

export class StorageManager implements StorageOperations {
    private _storage: StorageOperations;

    constructor(storage: StorageOperations) {
        this._storage = storage;
    }

    /**
     * Sets a storage
     * @param storage a given storage
     */
    public setStorage(storage: StorageOperations) {
        this._storage = storage;
    }

    /**
     * Saves metrics into the storage
     * @param data Metric data
     */
    public async save(data: Metric): Promise<void> {
        return this._storage.save(data);
    }

    /**
     * Closes storage
     */
    public async close(): Promise<void> {
        return this._storage.close();
    }
}