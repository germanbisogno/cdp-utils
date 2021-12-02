import * as fs from 'fs';
import { config } from "./config/config";
import { TraceOperations } from './traceOperations'
import CDP = require('chrome-remote-interface');
import * as logger from 'winston';
import { Protocol } from 'devtools-protocol';

export class Tracing extends TraceOperations {
    private _client: CDP.Client;
    private _events: Protocol.Tracing.DataCollectedEvent[] = [];
    private _traceFileName: string | undefined;

    constructor(client: CDP.Client, traceFileName?: string) {
        super();
        this._client = client;
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Tracing domain, captures dataCollected event
     */
    public async startTrace() {
        try {
            if (this._client) {
                this._client['Tracing.dataCollected'](({ value }: Protocol.Tracing.DataCollectedEvent) => {
                    this._events.push(...value);
                });
                await this._client.Tracing.start(config.tracing);
            }
        } catch (e) {
            logger.error(e);
        }
    }

    /**
     * Stop tracing, writes a trace file if provided
     * @returns collected events
     */
    public async stopTrace(): Promise<Protocol.Tracing.DataCollectedEvent[] | undefined> {
        try {
            if (this._client) {
                this._client['Tracing.tracingComplete'](() => {
                    if (this._traceFileName) {
                        fs.writeFileSync(this._traceFileName, JSON.stringify({ traceEvents: this._events }))
                    }
                })
                await this._client.Tracing.end();
                return this._events;
            }
        } catch (e) {
            logger.error(e);
        }
    }
}