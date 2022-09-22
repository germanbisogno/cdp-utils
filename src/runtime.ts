import { logger } from "./utils/logger";
import * as fs from 'fs';
import { TraceOperations } from "./traceOperations";
import { Protocol } from 'devtools-protocol';
import { CDPClient } from './cdpClient';
import CDP from "chrome-remote-interface";

export class Runtime extends TraceOperations {
    private _consoleLogEntries: Protocol.Runtime.ConsoleAPICalledEvent[] = [];
    private _traceFileName: string;
    private _client: CDP.Client;

    constructor(cdpClient: CDPClient, traceFileName: string = '') {
        super();
        this._client = cdpClient.get();
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Runtime domain, captures console messages
     */
    public async startTrace(): Promise<void> {
        try {
            if (this._client) {
                await this._client.send('Runtime.enable');
                this._client['Runtime.consoleAPICalled']((event: Protocol.Runtime.ConsoleAPICalledEvent) => {
                    this._consoleLogEntries.push(event);
                });
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }
    /**
     * Stop tracing, writes a trace file if provided
     * @returns console entries
     */
    public async stopTrace(): Promise<Protocol.Runtime.ConsoleAPICalledEvent[]> {
        try {
            if (this._client) {
                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(this._consoleLogEntries));
                }
                return this._consoleLogEntries;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            await this._client.send('Runtime.disable');
        }
        return [];
    }
}