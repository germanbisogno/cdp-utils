export interface Request {
  pageRef: string;
  startedDateTime: string;
  requestMethod: string;
  requestUrl: string;
  requestHttpVersion: string;
  requestHeaderSize: number;
  responseStatus: number;
  responseContentSize: number;
  responseContentType: string;
  responseCacheControl: string;
  time: number;
  blocked: number;
  dns: number;
  ssl: number;
  connect: number;
  send: number;
  wait: number;
  receive: number;
}
