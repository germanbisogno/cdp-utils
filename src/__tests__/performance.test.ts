import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { GooglePage } from '../pages/googlePage';
import { Performance } from '../performance';
import { CDPClient } from '../cdpClient';
import { config } from "../config/config";
import { getFreePort } from 'endpoint-utils';

jest.setTimeout(config.maxTimeout);

test('Test Performance', async () => {

    const port = await getFreePort();
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const cdpClient = new CDPClient();
    const client = await cdpClient.init(port);
    const performance = new Performance(client, 'startTrace.json', 'endTrace.json');

    const perfStartResults = await performance.startTrace();

    await driver.get("https://www.google.com");

    await googlePage.search('test');

    const perfEndResults = await performance.stopTrace();

    expect(perfStartResults.metrics.length).toBeGreaterThan(0);
    expect(perfEndResults.metrics.length).toBeGreaterThan(0);

    await cdpClient.close();

    await driver.quit()

});

