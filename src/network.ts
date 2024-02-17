import * as fs from 'fs';
import { TraceOperations } from './traceOperations';
import { logger } from './utils/logger';
import { NetworkConditions } from './interfaces/networkConditions';
import { Har } from 'har-format';
import { CDPClient } from './cdpClient';
import Protocol from 'devtools-protocol';
import { fromLog } from 'chrome-har-capturer';
import { cdpConfig } from './config/cdpConfig';

// event types to observe
const observe = [
  'Page.loadEventFired',
  'Page.domContentEventFired',
  'Page.navigatedWithinDocument',
  'Page.frameStartedLoading',
  'Page.frameAttached',  
  'Network.requestWillBeSent',
  'Network.requestServedFromCache',
  'Network.dataReceived',
  'Network.responseReceived',
  'Network.resourceChangedPriority',
  'Network.loadingFinished',
  'Network.loadingFailed',
  'Network.requestFinished',
  'Network.webSocketFrameReceived',
  'Network.webSocketFrameSent',
  'Network.getResponseBody',
  'Network.webSocketWillSendHandshakeRequest',
  'Network.webSocketHandshakeResponseReceived',
  'Network.webSocketClosed',
  'Network.resourceChangedPriority'
];

export const NETWORK_PRESETS = {
  GPRS: {
    offline: false,
    downloadThroughput: (50 * 1024) / 8,
    uploadThroughput: (20 * 1024) / 8,
    latency: 500,
  },
  Regular2G: {
    offline: false,
    downloadThroughput: (250 * 1024) / 8,
    uploadThroughput: (50 * 1024) / 8,
    latency: 300,
  },
  Good2G: {
    offline: false,
    downloadThroughput: (450 * 1024) / 8,
    uploadThroughput: (150 * 1024) / 8,
    latency: 150,
  },
  Regular3G: {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (250 * 1024) / 8,
    latency: 100,
  },
  Good3G: {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
  },
  Regular4G: {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
  },
  DSL: {
    offline: false,
    downloadThroughput: (2 * 1024 * 1024) / 8,
    uploadThroughput: (1 * 1024 * 1024) / 8,
    latency: 5,
  },
  WiFi: {
    offline: false,
    downloadThroughput: (30 * 1024 * 1024) / 8,
    uploadThroughput: (15 * 1024 * 1024) / 8,
    latency: 2,
  },
};

export class Network extends TraceOperations {
  private _traceFileName: string;
  protected _events: { method: string; params: object }[] = [];

  constructor(cdpClient: CDPClient, traceFileName = '') {
    super(cdpClient);
    this._traceFileName = traceFileName;
  }

  /**
   * Start tracing using Network and Page domain
   */
  public async startTrace(): Promise<void> {
    try {
      await this._client.send('Page.enable');
      await this._client.send('Network.enable');
      observe.forEach((method) => {
        this._client.on(method, (params) => {
          this._events.push({ method, params });
          if (logger.isDebugEnabled) {
            this.logEvents(method, params);
          }
        });
      });
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  /**
   * Stop tracing, writes a trace file if provided
   * @returns a promise of har events
   */
  public async stopTrace(): Promise<Har> {
    try {
      const har = await fromLog(cdpConfig.url, this._events);
      if (this._traceFileName) {
        fs.writeFileSync(this._traceFileName, JSON.stringify(har));
      }
      return har;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      await this._client.send('Page.disable');
      await this._client.send('Network.disable');
    }
  }

  /**
   * Logging specific network events
   * @param method event method being called
   * @param params object containing event's data
   */
  public logEvents(method: string, params: object) {
    let response: Protocol.Network.Response;
    switch (method) {
      case 'Network.responseReceived':
        response = params['response'] as Protocol.Network.Response;
        logger.debug(response.url);
        logger.debug(response.status);
        break;
      default:
    }
  }

  /**
   * Emulates network conditions
   * @param networkConditions given network conditions
   */
  public async emulateNetworkConditions(
    networkConditions: NetworkConditions
  ): Promise<void> {
    try {
      await this._client.send(
        'Network.emulateNetworkConditions',
        networkConditions
      );
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
