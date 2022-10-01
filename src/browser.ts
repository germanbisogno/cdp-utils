import { logger } from "./utils/logger";
import { Protocol } from 'devtools-protocol';
import { CDPClient } from './cdpClient';
import CDP from 'chrome-remote-interface';
import { BrowserOperations } from './browserOperations';

export class Browser extends BrowserOperations {
    private _client: CDP.Client;

    constructor(cdpClient: CDPClient) {
        super();
        this._client = cdpClient.get();
    }

    /**
     * Grant browser permissions
     * @returns response metrics
     */
    public async grantPermissions(grantPermissionRequest: Protocol.Browser.GrantPermissionsRequest): Promise<void> {
        try {
            if (this._client) {
                await this._client.send('Browser.grantPermissions', grantPermissionRequest);
            }
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }
}