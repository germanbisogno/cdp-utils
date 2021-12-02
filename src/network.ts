import * as fs from 'fs';
import { harFromMessages } from 'chrome-har';
import { TraceOperations } from './traceOperations'
import CDP = require('chrome-remote-interface');
import * as logger from 'winston';
import { NetworkConditions } from './interfaces/networkConditions';

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
    private _client: CDP.Client;
    private _events: any[] = [];
    private _traceFileName: string | undefined;

    constructor(client: CDP.Client, traceFileName?: string) {
        super();
        this._client = client;
        this._traceFileName = traceFileName;
    }

    /**
     * Start tracing using Network and Page domain
     */
    public async startTrace() {
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
        }
    }

    /**
     * Stop tracing, writes a trace file if provided
     * @returns a promise of har events
     */
    public async stopTrace(): Promise<any> {
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
        }
    }

    /**
     * Emulates network conditions
     * @param networkConditions given network conditions
     */
    public async emulateNetworkConditions(networkConditions: NetworkConditions) {
        try {
            if (this._client) {
                await this._client.send('Network.emulateNetworkConditions', networkConditions);
            }
        } catch (e) {
            logger.error(e);
        }
    }
}
