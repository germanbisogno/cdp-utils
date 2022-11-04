import * as CDP from 'chrome-remote-interface';
import { CDPClient } from './cdpClient';

import { Coordinates } from './interfaces/coordinates'
import { logger } from "./utils/logger";

export class GeoLocation {
    private _client: CDP.Client;

    constructor(cdpClient: CDPClient) {
        this._client = cdpClient.get();
    }
    /**
     * Emulates a geo location by coordinates
     * @param coordinates given coordinates
     */
    async emulateGeoLocation(coordinates: Coordinates): Promise<void> {
        try {
            await this._client.Emulation.setGeolocationOverride(coordinates);
        } catch (e) {
            logger.error(e);
            throw e;
        }
    };
}