import * as fs from 'fs';
import { harFromMessages } from 'chrome-har';
import { TraceOperations } from './traceOperations'
import { logger } from "./utils/logger";
import { NetworkConditions } from './interfaces/networkConditions';
import { Har } from 'har-format';
import { CDPSession } from './cdpSession';
import CDP from 'chrome-remote-interface';

// event types to observe
const observe = [
    'Page.loadEventFired',
    'Page.domContentEventFired',
    'Page.frameStartedLoading',
    'Page.frameAttached',
    'Network.requestWillBeSent',
    'Network.requestServedFromCache',
    'Network.dataReceived',
    'Network.responseReceived',
    'Network.resourceChangedPriority',
    'Network.loadingFinished',
    'Network.loadingFailed',
    'Network.requestFinished'
];

export const NETWORK_PRESETS = {
    'GPRS': {
        'offline': false,
        'downloadThroughput': 50 * 1024 / 8,
        'uploadThroughput': 20 * 1024 / 8,
        'latency': 500
    },
    'Regular2G': {
        'offline': false,
        'downloadThroughput': 250 * 1024 / 8,
        'uploadThroughput': 50 * 1024 / 8,
        'latency': 300
    },
    'Good2G': {
        'offline': false,
        'downloadThroughput': 450 * 1024 / 8,
        'uploadThroughput': 150 * 1024 / 8,
        'latency': 150
    },
    'Regular3G': {
        'offline': false,
        'downloadThroughput': 750 * 1024 / 8,
        'uploadThroughput': 250 * 1024 / 8,
        'latency': 100
    },
    'Good3G': {
        'offline': false,
        'downloadThroughput': 1.5 * 1024 * 1024 / 8,
        'uploadThroughput': 750 * 1024 / 8,
        'latency': 40
    },
    'Regular4G': {
        'offline': false,
        'downloadThroughput': 4 * 1024 * 1024 / 8,
        'uploadThroughput': 3 * 1024 * 1024 / 8,
        'latency': 20
    },
    'DSL': {
        'offline': false,
        'downloadThroughput': 2 * 1024 * 1024 / 8,
        'uploadThroughput': 1 * 1024 * 1024 / 8,
        'latency': 5
    },
    'WiFi': {
        'offline': false,
        'downloadThroughput': 30 * 1024 * 1024 / 8,
        'uploadThroughput': 15 * 1024 * 1024 / 8,
        'latency': 2
    }
}

export class Network extends TraceOperations {
    private _traceFileName: string;
    protected _events: any[] = [];
    private _client: CDP.Client;

    constructor(cdpSession: CDPSession, traceFileName: string = '') {
        super();
        this._client = cdpSession.client;
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Network and Page domain
     */
    public async startTrace(): Promise<void> {
        try {
            if (this._client) {
                await this._client.send('Page.enable');
                await this._client.send('Network.enable');
                observe.forEach(method => {
                    this._client.on(method, params => {
                        this._events.push({ method, params });
                    });
                });
            }
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
            if (this._client) {
                const har = await harFromMessages(this._events, { includeTextFromResponseBody: true });
                if (this._traceFileName) {
                    fs.writeFileSync(this._traceFileName, JSON.stringify(har));
                }
                return har;
            }
        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            await this._client.send('Page.disable');
            await this._client.send('Network.disable');
        }
        return { log: { entries: [], version: '', creator: { name: '', version: '' } } }
    }

    /**
     * Emulates network conditions
     * @param networkConditions given network conditions
     */
    public async emulateNetworkConditions(networkConditions: NetworkConditions): Promise<void> {
        try {
            if (this._client) {
                await this._client.send('Network.emulateNetworkConditions', networkConditions);
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }
}
