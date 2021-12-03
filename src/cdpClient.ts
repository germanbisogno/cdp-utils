import * as CDP from "chrome-remote-interface";
import { logger } from "./utils/logger";

export class CDPClient {
    private _client: CDP.Client | undefined;

    /**
     * Initializes the CDP client connection
     * @port a given port number
     * @returns CDP Client
     */
    public async init(port: number | undefined): Promise<CDP.Client> {
        this._client = await CDP({ port });
        logger.info('CDP Session created using port: ' + port);
        return this._client;
    }

    /**
     * Closes the CDP client connection
     */
    public async close(): Promise<void> {
        if (this._client) {
            await this._client.close()
        }
    }
}