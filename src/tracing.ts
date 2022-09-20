import * as fs from 'fs';
import { config } from "./config/config";
import { TraceOperations } from './traceOperations'
import { logger } from "./utils/logger";
import { Protocol } from 'devtools-protocol';
import { CDPSession } from './cdpSession';

export class Tracing extends TraceOperations {
    private _traceFileName: string;
    protected _events: Protocol.Tracing.DataCollectedEvent[] = [];

    constructor(traceFileName: string = '') {
        super();
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Tracing domain, captures events
     */
    public async startTrace() {
        try {
            if (CDPSession.client) {
                CDPSession.client['Tracing.dataCollected'](({ value }: Protocol.Tracing.DataCollectedEvent) => {
                    this._events.push(...value);
                });
                await CDPSession.client.send('Tracing.start', config.tracing);
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    /**
     * Stop tracing, writes a trace file if provided
     * @returns collected events
     */
    public async stopTrace(): Promise<Protocol.Tracing.DataCollectedEvent[]> {
        try {
            if (CDPSession.client) {
                await CDPSession.client.send('Tracing.end');
                await CDPSession.client['Tracing.tracingComplete']();

                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(this._events, null, 2))
                }

                return this._events;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
        return [];
    }
}