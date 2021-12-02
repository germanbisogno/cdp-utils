import CDP = require("chrome-remote-interface");
import * as logger from 'winston';
import * as fs from 'fs';
import { TraceOperations } from "./traceOperations";
import { Protocol } from 'devtools-protocol';

export class Runtime extends TraceOperations {
    private _client: CDP.Client;
    private _consoleLogEntries: Protocol.Runtime.ConsoleAPICalledEvent[] = [];
    private _traceFileName: string | undefined;

    constructor(client: CDP.Client, traceFileName?: string) {
        super();
        this._client = client;
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
        }
    }
    /**
     * Stop tracing, writes a trace file if provided
     * @returns console entries
     */
    public async stopTrace(): Promise<any> {
        try {
            if (this._client) {
                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(this._consoleLogEntries));
                }
                return this._consoleLogEntries;
            }
        } catch (e) {
            logger.error(e);
        }
    }
}