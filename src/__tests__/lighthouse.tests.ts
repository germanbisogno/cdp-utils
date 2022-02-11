import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { CDPClient } from "../cdpClient";
import { GooglePage } from '../pages/googlePage';
import { Lighthouse } from '../lighthouse';
import { config } from "../config/config";
import { getFreePort } from 'endpoint-utils';
import * as DesktopConfig from 'lighthouse/lighthouse-core/config/desktop-config.js';

jest.setTimeout(config.maxTimeout);

const DESKTOP_USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36 Chrome-Lighthouse'; // eslint-disable-line max-len

test('Test Lighthouse', async () => {

    const port = await getFreePort();
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const cdpClient = new CDPClient();
    await cdpClient.init(port);

    const lighthouse = new Lighthouse(port);

    await lighthouse.initWorkFlow('Google search', DesktopConfig.settings)

    await lighthouse.navigate("https://www.google.com");

    await lighthouse.startTrace('search operation');

    await googlePage.search('test');

    const res = await lighthouse.stopTrace();

    lighthouse.generateFlowReport('lighthouse.html');

    await cdpClient.close();

    await driver.quit();

    expect(res.lhr.categories.performance.score).toBeGreaterThanOrEqual(0.8);

});


