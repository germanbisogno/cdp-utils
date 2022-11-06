export interface NetworkConditions {
  // Whether chrome should simulate
  // the absence of connectivity
  offline: boolean;
  // Simulated download speed (bytes/s)
  downloadThroughput: number;
  // Simulated upload speed (bytes/s)
  uploadThroughput: number;
  // Simulated latency (ms)
  latency: number;
}
