import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import { GooglePage } from '../pages/googlePage';
import { Lighthouse } from '../lighthouse';
import { getFreePort } from 'endpoint-utils';
import { desktopConfig } from 'lighthouse';
import { expect } from 'chai';

it('Test Lighthouse', async () => {
  const port = await getFreePort();
  const options = new chrome.Options();

  options.addArguments(`--remote-debugging-port=${port}`);
  options.addArguments('--start-maximized');
  options.excludeSwitches('--enable-logging');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  const googlePage = new GooglePage(driver);

  const lighthouse = new Lighthouse(port);

  await lighthouse.initWorkFlow('Google search', desktopConfig, {
    width: 1920,
    height: 1080,
  });

  await lighthouse.navigate('https://www.google.com');

  await lighthouse.startTrace('search operation');

  await googlePage.search('test');

  const res = await lighthouse.stopTrace();

  await driver.quit();

  await lighthouse.generateFlowReport('lighthouse.html');

  res.forEach((step) => {
    expect(step.lhr.categories.performance.score).greaterThanOrEqual(0.8);
  });
});
