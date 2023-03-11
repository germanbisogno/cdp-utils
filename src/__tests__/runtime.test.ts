import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import { GooglePage } from '../pages/googlePage';
import { Runtime } from '../runtime';
import { CDPClient } from '../cdpClient';
import { getFreePort } from 'endpoint-utils';
import { cdpConfig } from '../config/cdpConfig';

jest.setTimeout(cdpConfig.maxTimeout);

test('Test Runtime', async () => {
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

  const runtime = new Runtime(cdpClient, 'console.json');

  await runtime.startTrace();

  await driver.get('https://www.google.com');

  await driver.executeScript(() => {
    console.error('test error message');
    console.warn('test warning message');
    console.log('test log message');
  });

  await googlePage.search('test');

  const consoleResults = await runtime.stopTrace();

  expect(consoleResults.find((x) => x.type === 'error')).toBeDefined();
  expect(consoleResults.find((x) => x.type === 'warning')).toBeDefined();
  expect(consoleResults.find((x) => x.type === 'log')).toBeDefined();

  await cdpClient.close();

  await driver.quit();
});
