import { Metric } from '../interfaces/metrics';
import { ClientOptions, InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client'
import * as os from 'os';
import { logger } from '../utils/logger';

/** 
 * Environment variables 
 */
const host = process.env.INFLUX_HOST ? process.env.INFLUX_HOST : 'localhost';
const org = process.env.INFLUX_ORG ? process.env.INFLUX_ORG : 'test';
const bucket = process.env.INFLUX_BUCKET ? process.env.INFLUX_BUCKET : 'test';
const port = process.env.INFLUX_PORT ? process.env.INFLUX_PORT : 8086;
const token = process.env.INFLUX_TOKEN;

/**
 * Class that implements functionality for influx db.
 */
export class InfluxStorage {
    private _influxDB: InfluxDB | undefined;
    private _writeApi: WriteApi;

    constructor() {
        const clientOptions: ClientOptions = {
            url: `http://${host}:${port}`,
            token,
        }

        this._influxDB = new InfluxDB(clientOptions)
        this._writeApi = this._influxDB.getWriteApi(org, bucket)
    }

    /**
     * Saves metrics into the db
     * @param data metric's data
     */
    public async save(data: Metric): Promise<void> {

        for (let i = 0; i < data.times.length; i++) {
            const point = new Point('fps')
                .tag('host', os.hostname())
                .tag('fps_time', data.times[i])
                .floatField('value', data.values[i])
            this._writeApi.writePoint(point);
        }

        await this._writeApi.flush().catch(e => logger.error('flushed failed', e))
        await this._writeApi.close().catch(logger.error)

    }

    /**
     * Closes the write api
     */
    public close(): Promise<void> {
        this._influxDB = undefined;
        return this._writeApi.close();
    }

}