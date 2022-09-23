import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { CDPClient } from '../cdpClient';
import { GooglePage } from '../pages/googlePage';
import { Tracing } from '../tracing';
import { cdpConfig } from "../config/cdpConfig";
import { getFreePort } from 'endpoint-utils';

jest.setTimeout(cdpConfig.maxTimeout);

test('Test Tracing', async () => {

    const port = await getFreePort();
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const cdpClient = new CDPClient();
    await cdpClient.init(port);
    
    const tracing = new Tracing(cdpClient, 'tracing.json');

    await driver.get("https://www.google.com");

    await tracing.startTrace();

    await googlePage.search('test');

    const tracingResults = await tracing.stopTrace();

    expect(tracingResults.length).toBeGreaterThan(0);

    await cdpClient.close();

    await driver.quit();
});


