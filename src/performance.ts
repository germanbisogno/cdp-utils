import * as CDP from 'chrome-remote-interface';
import { TraceOperations } from './traceOperations'
import { logger } from "./utils/logger";
import { Protocol } from 'devtools-protocol';
import * as fs from 'fs';

export class Performance extends TraceOperations {
    private _client: CDP.Client;
    private _traceFileName: string;

    constructor(client: CDP.Client, traceFileName: string = '') {
        super();
        this._client = client;
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Performance domain
     */
    public async startTrace(): Promise<void> {
        try {
            if (this._client) {
                await this._client.send("Performance.enable");
            }
        } catch (e) {
            logger.error(e);
        }
    }

    /**
     * Stop tracing, writes a trace file if provided
     * @returns response metrics
     */
    public async stopTrace(): Promise<Protocol.Performance.GetMetricsResponse> {
        try {
            if (this._client) {
                const metrics = await this.getMetrics();
                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(metrics))
                }
                return metrics;
            }
        } catch (e) {
            logger.error(e);
        }
        return { metrics: []};
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
        return { metrics: []};
    }
}