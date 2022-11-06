import { TraceOperations } from './traceOperations';
import { logger } from './utils/logger';
import { Protocol } from 'devtools-protocol';
import * as fs from 'fs';
import { CDPClient } from './cdpClient';
import CDP from 'chrome-remote-interface';

export class Performance extends TraceOperations {
  private _startTraceFileName: string;
  private _endTraceFileName: string;
  private _client: CDP.Client;

  constructor(
    cdpClient: CDPClient,
    startTraceFileName = '',
    endTraceFileName = ''
  ) {
    super();
    this._client = cdpClient.get();
    this._startTraceFileName = startTraceFileName;
    this._endTraceFileName = endTraceFileName;
  }

  /**
   * Start tracing using Performance domain
   */
  public async startTrace(): Promise<Protocol.Performance.GetMetricsResponse> {
    try {
      await this._client.send('Performance.enable');
      const metrics = await this.getMetrics();
      if (this._startTraceFileName) {
        fs.writeFileSync(this._startTraceFileName, JSON.stringify(metrics));
      }
      return metrics;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  /**
   * Stop tracing, writes a trace file if provided
   * @returns response metrics
   */
  public async stopTrace(): Promise<Protocol.Performance.GetMetricsResponse> {
    try {
      const metrics = await this.getMetrics();
      if (this._endTraceFileName) {
        fs.writeFileSync(this._endTraceFileName, JSON.stringify(metrics));
      }
      return metrics;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      await this._client.send('Performance.disable');
    }
  }

  /**
   * Retrieves metrics using Performance domain
   * @returns response metrics
   */
  private async getMetrics(): Promise<Protocol.Performance.GetMetricsResponse> {
    try {
      const response = await this._client.send('Performance.getMetrics');
      return response;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
