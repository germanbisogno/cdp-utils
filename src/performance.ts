import { TraceOperations } from './traceOperations'
import { logger } from "./utils/logger";
import { Protocol } from 'devtools-protocol';
import * as fs from 'fs';
import { CDPSession } from './cdpSession';

export class Performance extends TraceOperations {
    private _startTraceFileName: string;
    private _endTraceFileName: string;

    constructor(startTraceFileName: string = '',
        endTraceFileName: string = '') {
        super();
        this._startTraceFileName = startTraceFileName;
        this._endTraceFileName = endTraceFileName;
    }

    /**
     * Start tracing using Performance domain
     */
    public async startTrace(): Promise<Protocol.Performance.GetMetricsResponse> {
        try {
            if (CDPSession.client) {
                await CDPSession.client.send("Performance.enable");
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
            if (CDPSession.client) {
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
            await CDPSession.client.send("Performance.disable");
        }
        return { metrics: [] };
    }

    /**
     * Retrieves metrics using Performance domain
     * @returns response metrics
     */
    private async getMetrics(): Promise<Protocol.Performance.GetMetricsResponse> {
        if (CDPSession.client) {
            const response = await CDPSession.client.send('Performance.getMetrics');
            return response;
        }
        return { metrics: [] };
    }
}