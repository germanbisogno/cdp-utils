import { Request } from './request';

export interface DatabaseOperations {
  sendRequests(requests: Request[]): Promise<void>;
}
