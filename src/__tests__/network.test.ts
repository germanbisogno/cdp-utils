import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { GooglePage } from '../pages/googlePage';
import { Network } from '../network';
import { CDPSession } from '../cdpSession';
import { config } from "../config/config";
import { getFreePort } from 'endpoint-utils';
import { Har } from "har-format";

jest.setTimeout(config.maxTimeout);

test('Test Network', async () => {

    const port = await getFreePort();
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const cdpSession = new CDPSession();
    await cdpSession.init(port);

    const network = new Network(cdpSession, 'network.har');

    await network.startTrace();

    await driver.get("https://www.google.com");

    await googlePage.search('test');

    const networkResults: Har = await network.stopTrace();
    expect(networkResults.log.entries.length).toBeGreaterThan(0);

    await cdpSession.close();

    await driver.quit()

});

