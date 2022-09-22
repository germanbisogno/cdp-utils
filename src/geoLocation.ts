import * as CDP from 'chrome-remote-interface';
import { CDPSession } from './cdpSession';

import { Coordinates } from './interfaces/coordinates'
import { logger } from "./utils/logger";

export class GeoLocation {
    private _client: CDP.Client;

    constructor(cdpSession: CDPSession) {
        this._client = cdpSession.client;
    }
    /**
     * Emulates a geo location by coordinates
     * @param coordinates given coordinates
     */
    async emulateGeoLocation(coordinates: Coordinates): Promise<void> {
        try {
            if (this._client) {
                await this._client.Emulation.setGeolocationOverride(coordinates);
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    };
}