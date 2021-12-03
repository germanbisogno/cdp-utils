import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { CDPClient } from "../cdpClient";
import { GooglePage } from '../pages/googlePage';
import { Tracing } from '../tracing';
import { config } from "../config/config";

const options = new chrome.Options();

options.addArguments(`--remote-debugging-port=${config.cdpPort}`);

jest.setTimeout(config.maxTimeout);

test('Test Tracing', async () => {
    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const client = await CDPClient.init();

    const tracing = new Tracing(client, 'trace.json');

    await tracing.startTrace();

    await driver.get("https://www.google.com");

    await googlePage.search('test');

    await tracing.stopTrace();
    await CDPClient.close();

    await driver.quit();
});