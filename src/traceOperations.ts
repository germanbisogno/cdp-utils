import Protocol from 'devtools-protocol';
import { Har } from 'har-format';
import { FlowResult } from 'lighthouse';
import { CDPClient } from './cdpClient';
import CDP from 'chrome-remote-interface';

export abstract class TraceOperations {
  protected _client: CDP.Client;

  constructor(client: CDPClient) {
    this._client = client.get();
  }

  abstract startTrace(
    stepName?: string
  ): Promise<void> | Promise<Protocol.Performance.GetMetricsResponse>;
  abstract stopTrace():
    | Promise<void>
    | Promise<Protocol.Runtime.ConsoleAPICalledEvent[]>
    | Promise<Protocol.Performance.GetMetricsResponse>
    | Promise<Protocol.Tracing.DataCollectedEvent[]>
    | Promise<FlowResult.Step[]>
    | Promise<Har>;
  public async navigateTo(url: string): Promise<void> {
    await this._client.send('Page.enable');
    await this._client.send('Page.navigate', { url: url });
  }
}
