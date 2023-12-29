import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import { logger } from '../../utils/logger';
import { Request } from '../interfaces/request';
import * as os from 'os';

/** Environment variables **/
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

export class InfluxDBManager {
  private influxDB: InfluxDB;
  private writeApi: WriteApi;

  constructor() {
    /**
     * Instantiate the InfluxDB client
     * with a configuration object.
     **/
    this.influxDB = new InfluxDB({ url, token });
    /**
     * Create a write client from the getWriteApi method.
     * Provide your `org` and `bucket`.
     **/
    this.writeApi = this.influxDB.getWriteApi(org, bucket);
    /**
     * Apply default tags to all points.
     **/
  }

  /**
   * Sends requests to InfluxDB
   * @param requests list of requests
   */
  public async sendRequests(requests: Request[]): Promise<void> {
    try {
      for (const element of requests) {
        const ts = new Date(element.startedDateTime);
        /**
         * Create a point and write it to the buffer.
         **/
        const point1 = new Point('request')
          .timestamp(ts)
          .tag('host', os.hostname())
          .tag('requestUrl', element.requestUrl)
          .floatField('duration', element.time);

        this.writeApi.writePoint(point1);
      }
      /**
       * Flush pending writes and close writeApi.
       **/
      this.writeApi.close().then(() => {
        logger.info('WRITE FINISHED');
      });
    } catch (error) {
      logger.error('error message: ', error.message);
      throw error;
    }
  }
}
