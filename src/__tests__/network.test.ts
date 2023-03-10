import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import { GooglePage } from '../pages/googlePage';
import { Network } from '../network';
import { CDPClient } from '../cdpClient';
import { getFreePort } from 'endpoint-utils';
import { Har } from 'har-format';
import { cdpConfig } from '../config/cdpConfig';
import { DatabaseManager } from '../performance/databaseManager';
import { Utils } from '../utils/transformHar';

jest.setTimeout(cdpConfig.maxTimeout);

test('Test Network', async () => {
  const port = await getFreePort();
  const options = new chrome.Options();

  options.addArguments(`--remote-debugging-port=${port}`);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  const googlePage = new GooglePage(driver);
  const cdpClient = new CDPClient();
  await cdpClient.init(port);

  const network = new Network(cdpClient, 'network.har');

  await network.startTrace();

  await driver.get('https://www.google.com');

  await googlePage.search('test');

  const networkResults: Har = await network.stopTrace();
  expect(networkResults.log.entries.length).toBeGreaterThan(0);

  const requests = Utils.transformHar(networkResults);
  await DatabaseManager.getDatabaseProvider().sendRequests(requests);

  await cdpClient.close();

  await driver.quit();
});
