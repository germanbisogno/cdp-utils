import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import { CDPClient } from '../cdpClient';
import { GooglePage } from '../pages/googlePage';
import { Browser } from '../browser';
import { getFreePort } from 'endpoint-utils';

xit('Test Browser', async () => {
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

  const browser = new Browser(cdpClient);

  await driver.get('https://www.google.com');

  const url = await driver.getCurrentUrl();
  await browser.grantPermissions({
    origin: url,
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
  });

  await googlePage.searchFromClipboard();

  await cdpClient.close();

  await driver.quit();
});
