import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { CDPSession } from '../cdpSession';
import { GooglePage } from '../pages/googlePage';
import { Tracing } from '../tracing';
import { config } from "../config/config";
import { getFreePort } from 'endpoint-utils';

jest.setTimeout(config.maxTimeout);

test('Test Tracing', async () => {

    const port = await getFreePort();
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const cdpSession = new CDPSession();
    await cdpSession.init(port);
    
    const tracing = new Tracing(cdpSession, 'tracing.json');

    await driver.get("https://www.google.com");

    await tracing.startTrace();

    await googlePage.search('test');

    const tracingResults = await tracing.stopTrace();

    expect(tracingResults.length).toBeGreaterThan(0);

    await cdpSession.close();

    await driver.quit();
});


