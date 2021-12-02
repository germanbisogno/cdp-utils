import * as fs from 'fs';

export interface Config {
    tracing: {
        traceConfig: {
            includedCategories: string[];
            excludedCategories: string[];
        }
    }
    cdpPort: number;
    maxTimeout: number;
}

export const config: Config = JSON.parse(fs.readFileSync('config/config.json', { encoding: 'utf-8', flag: 'r' }).toString());


