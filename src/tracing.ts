import * as fs from 'fs';
import { TraceOperations } from './traceOperations';
import { logger } from './utils/logger';
import { Protocol } from 'devtools-protocol';
import { CDPClient } from './cdpClient';
import { cdpConfig } from './config/cdpConfig';

export class Tracing extends TraceOperations {
  private _traceFileName: string;
  protected _events: Protocol.Tracing.DataCollectedEvent[] = [];

  constructor(cdpClient: CDPClient, traceFileName = '') {
    super(cdpClient);
    this._traceFileName = traceFileName;
  }

  /**
   * Start tracing using Tracing domain, captures events
   */
  public async startTrace() {
    try {
      await this._client.send('Page.enable');
      await this._client.send('Tracing.start', cdpConfig.tracing);
      this._client.on(
        'Tracing.dataCollected',
        ({ value }: Protocol.Tracing.DataCollectedEvent) => {
          this._events.push(...value);
        }
      );
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
      await new Promise((resolve, reject) => {
        this._client.on('Tracing.tracingComplete', () => {
          resolve(this._events);
          if (this._traceFileName) {
            fs.writeFileSync(
              this._traceFileName,
              JSON.stringify(this._events, null, 2)
            );
          }
        });
        this._client.send('Tracing.end').catch(reject);
      });
      return this._events;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
