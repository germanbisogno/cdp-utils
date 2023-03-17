import { InfluxDBManager } from './database/influxDBManager';
import { DatabaseOperations } from './interfaces/databaseOerations';

export enum DBProvider {
  InfluxDB,
}

/**
 * A database manager to handle database operations from each provider
 */
export class DatabaseManager {
  private static databaseOperations: DatabaseOperations;

  /**
   * Returns a database provider
   * @returns DatabaseOperations interface
   */
  public static getDatabaseProvider(
    dBProvider: DBProvider = DBProvider.InfluxDB
  ): DatabaseOperations {
    if (!this.databaseOperations) {
      switch (dBProvider) {
        case DBProvider.InfluxDB:
          this.databaseOperations = new InfluxDBManager();
          return this.databaseOperations;
      }
    } else {
      return this.databaseOperations;
    }
  }
}
