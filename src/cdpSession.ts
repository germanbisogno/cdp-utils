import CDP from "chrome-remote-interface";
import { logger } from "./utils/logger";

export class CDPSession{
    public static client: CDP.Client;

    /**
     * Initializes the CDP client connection
     * @port a given port number
     * @returns CDP Client
     */
    public static async init(port: number): Promise<void> {
        try {
            this.client = await CDP({ port });

            logger.info('CDP Session created using port: ' + port);
        } catch (e) {
            logger.error('CDP Session not created! due to: ' + e);
            throw e;
        }
    }

    /**
     * Closes the CDP client connection
     */
    public static async close(): Promise<void> {
        if (this.client) {
            await this.client.close()
        }
    }
}