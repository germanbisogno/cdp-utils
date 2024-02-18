import Protocol from 'devtools-protocol';
import * as fs from 'fs';

export interface CDPConfig {
  tracing: Protocol.Tracing.StartRequest;
  cdpPort: number;
  maxTimeout: number;
  url: string;
}

export const cdpConfig: CDPConfig = JSON.parse(
  fs
    .readFileSync('config/cdp.config.json', { encoding: 'utf-8', flag: 'r' })
    .toString()
);
