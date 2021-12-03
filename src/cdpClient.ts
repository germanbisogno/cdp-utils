import * as CDP from "chrome-remote-interface";
import { config } from "./config/config";

export class CDPClient {
    private static _client: CDP.Client;

    /**
     * Initializes the CDP client connection
     * @returns CDP Client
     */
    public static async init(): Promise<CDP.Client> {
        if (!this._client) {
            this._client = await CDP({ port: config.cdpPort });
        }
        return this._client;
    }

    /**
     * Closes the CDP client connection
     */
    public static async close(): Promise<void> {
        if (this._client) {
            await this._client.close()
        }
    }
}