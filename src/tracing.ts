import * as fs from 'fs';
import { config } from "./config/config";
import { TraceOperations } from './traceOperations'
import * as CDP from 'chrome-remote-interface';
import { logger } from "./utils/logger";
import { Protocol } from 'devtools-protocol';
import Tracelib from 'tracelib';
import { Metric } from './interfaces/metrics';

export class Tracing extends TraceOperations {
    private _client: CDP.Client | undefined;
    private _traceFileName: string;

    constructor(client: CDP.Client | undefined, traceFileName: string = '') {
        super();
        this._client = client;
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Tracing domain, captures events
     */
    public async startTrace() {
        try {
            if (this._client) {
                this._client['Tracing.dataCollected'](({ value }: Protocol.Tracing.DataCollectedEvent) => {
                    this._events.push(...value);
                });
                await this._client.send('Tracing.start', config.tracing);
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
            if (this._client) {
                await this._client.send('Tracing.end');
                await this._client['Tracing.tracingComplete']();

                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(this._events, null, 2))
                }

                await this.saveMetrics();

                return this._events;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
        return [];
    }

    /**
     * Fetch total time-durations of scripting, rendering, painting from tracelogs.
     */
    public getSummary(): Metric {
        const tasks = new Tracelib(this._events);
        const summary = tasks.getSummary();
        return summary;
    }
    /**
     * Fetch frames per second.
     */
    public getFPS(): Metric {
        const tasks = new Tracelib(this._events);
        const fps = tasks.getFPS();
        return fps;
    }

    /**
     * Fetch data for JS Heap, Documents, Nodes, Listeners and GPU Memory from tracelogs.
     * @returns 
     */
    public getMemoryCounters(): Metric {
        const tasks = new Tracelib(this._events)
        const memoryInfo = tasks.getMemoryCounters();
        return memoryInfo;
    }

    /**
     * Save metrics in the default storage
     */
    async saveMetrics(): Promise<void> {
        this._storage.save(this.getFPS());
    }
}