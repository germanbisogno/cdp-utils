import { logger } from "./utils/logger";
import * as fs from 'fs';
import { TraceOperations } from "./traceOperations";
import { Protocol } from 'devtools-protocol';
import { CDPSession } from './cdpSession';

export class Runtime extends TraceOperations {
    private _consoleLogEntries: Protocol.Runtime.ConsoleAPICalledEvent[] = [];
    private _traceFileName: string;

    constructor(traceFileName: string = '') {
        super();
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Runtime domain, captures console messages
     */
    public async startTrace(): Promise<void> {
        try {
            if (CDPSession.client) {
                await CDPSession.client.send('Runtime.enable');
                CDPSession.client['Runtime.consoleAPICalled']((event: Protocol.Runtime.ConsoleAPICalledEvent) => {
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
            if (CDPSession.client) {
                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(this._consoleLogEntries));
                }
                return this._consoleLogEntries;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            await CDPSession.client.send('Runtime.disable');
        }
        return [];
    }
}