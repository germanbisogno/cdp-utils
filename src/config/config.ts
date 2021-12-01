export interface Config {
    tracing: {
        includedCategories: string[];
        excludedCategories: string[];
    }
    cdpPort: number;
    maxTimeout: number;
}