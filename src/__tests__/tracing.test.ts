import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { CDPClient } from "../cdpClient";
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

    const cdpClient = new CDPClient();
    const client = await cdpClient.init(port);

    // Shows FPS Counter
    await client.send('Overlay.setShowFPSCounter', { show: true });

    const tracing = new Tracing(client, 'tracing.json');

    await tracing.startTrace();

    await driver.get("https://www.google.com");

    await googlePage.search('test');

    const tracingResults = await tracing.stopTrace();

    expect(tracingResults.length).toBeGreaterThan(0);

    await cdpClient.close();

    await driver.quit();
});

