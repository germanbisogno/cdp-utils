import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import { Network } from '../network';
import { CDPClient } from '../cdpClient';
import { getFreePort } from 'endpoint-utils';
import { Har } from 'har-format';
import { expect } from 'chai';
import { WebSocketPage } from '../pages/webSocketPage';
import express, { Express } from 'express';
import { WebSocketServer } from 'ws';

let server;

before(function () {
  const app: Express = express();
  server = app
    .use((req, res) =>
      res.sendFile('./websocket-client.html', {
        root: './src/__tests__/server',
      })
    )
    .listen(3000, () => console.log(`Listening on ${3000}`));

  const sockserver = new WebSocketServer({ port: 443 });
  sockserver.on('connection', (ws) => {
    console.log('New client connected!');
    ws.send('connection established');
    ws.on('close', () => console.log('Client has disconnected!'));
    ws.on('message', (data) => {
      sockserver.clients.forEach((client) => {
        console.log(`distributing message: ${data}`);
        client.send(`${data}`);
      });
    });
    ws.onerror = function () {
      console.log('websocket error');
    };
  });
});

after(async () => {
  await server.close();
});

it('Test Network', async () => {
  const port = await getFreePort();
  const options = new chrome.Options();

  options.addArguments(`--remote-debugging-port=${port}`);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  const webSocketPage = new WebSocketPage(driver);
  const cdpClient = new CDPClient();
  await cdpClient.init(port);

  const network = new Network(cdpClient, 'network.har');

  await network.startTrace();

  await driver.get('http://localhost:3000');

  await webSocketPage.sendMessage('test');

  const networkResults: Har = await network.stopTrace();
  expect(networkResults.log.entries.length).greaterThan(0);

  await cdpClient.close();

  await driver.quit();
});
