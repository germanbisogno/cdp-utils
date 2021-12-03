import * as CDP from "chrome-remote-interface";

export class CDPClient {
    private _client: CDP.Client | undefined;

    /**
     * Initializes the CDP client connection
     * @returns CDP Client
     */
    public async init(port: number | undefined): Promise<CDP.Client> {
        this._client = await CDP({ port });
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