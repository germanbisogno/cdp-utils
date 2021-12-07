import * as CDP from 'chrome-remote-interface';
import { TraceOperations } from './traceOperations'
import { logger } from "./utils/logger";
import { Protocol } from 'devtools-protocol';
import * as fs from 'fs';

export class Performance extends TraceOperations {
    private _client: CDP.Client;
    private _startTraceFileName: string;
    private _endTraceFileName: string;

    constructor(client: CDP.Client, startTraceFileName: string = '',
        endTraceFileName: string = '') {
        super();
        this._client = client;
        this._startTraceFileName = startTraceFileName;
        this._endTraceFileName = endTraceFileName;
    }

    /**
     * Start tracing using Performance domain
     */
    public async startTrace(): Promise<Protocol.Performance.GetMetricsResponse> {
        try {
            if (this._client) {
                await this._client.send("Performance.enable");
                const metrics = await this.getMetrics();
                if (this._startTraceFileName) {
                    fs.writeFileSync(this._startTraceFileName, JSON.stringify(metrics))
                }
                return metrics;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
        return { metrics: [] };
    }

    /**
     * Stop tracing, writes a trace file if provided
     * @returns response metrics
     */
    public async stopTrace(): Promise<Protocol.Performance.GetMetricsResponse> {
        try {
            if (this._client) {
                const metrics = await this.getMetrics();
                if (this._endTraceFileName) {
                    fs.writeFileSync(this._endTraceFileName, JSON.stringify(metrics))
                }
                return metrics;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            await this._client.send("Performance.disable");
        }
        return { metrics: [] };
    }

    /**
     * Retrieves metrics using Performance domain
     * @returns response metrics
     */
    private async getMetrics(): Promise<Protocol.Performance.GetMetricsResponse> {
        if (this._client) {
            const response = await this._client.send('Performance.getMetrics');
            return response;
        }
        return { metrics: [] };
    }
}