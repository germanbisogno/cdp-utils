import CDP from "chrome-remote-interface";
import { logger } from "./utils/logger";

export class CDPSession{
    private _client: CDP.Client;

    /**
     * Initializes the CDP client connection
     * @port a given port number
     * @returns CDP Client
     */
    public async init(port: number): Promise<void> {
        try {
            this._client = await CDP({ port });

            logger.info('CDP Session created using port: ' + port);
        } catch (e) {
            logger.error('CDP Session not created! due to: ' + e);
            throw e;
        }
    }

    /**
     * Gets the CDP client connection
     */
    public get client(): CDP.Client {
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