import CDP = require("chrome-remote-interface");
import * as logger from 'winston';
import { Coordinates } from './interfaces/coordinates'

export class GeoLocation {
    private _client: CDP.Client;

    constructor(client: CDP.Client) {
        this._client = client;
    }
    /**
     * Emulates a geo location by coordinates
     * @param coordinates given coordinates
     */
    async emulateGeoLocation(coordinates: Coordinates) {
        try {
            if (this._client) {
                await this._client.Emulation.setGeolocationOverride(coordinates);
            }
        } catch (e) {
            logger.error(e);
        }
    };
}