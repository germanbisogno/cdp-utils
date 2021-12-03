import Protocol from 'devtools-protocol';
import * as fs from 'fs';

export interface Config {
    tracing: Protocol.Tracing.StartRequest;
    cdpPort: number;
    maxTimeout: number;
}

export const config: Config = JSON.parse(fs.readFileSync('config/config.json', { encoding: 'utf-8', flag: 'r' }).toString());


