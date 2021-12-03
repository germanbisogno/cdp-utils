import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { GooglePage } from '../pages/googlePage';
import { Network } from '../network';
import { CDPClient } from '../cdpClient';
import { config } from "../config/config";
import { getFreePort } from 'endpoint-utils';

jest.setTimeout(config.maxTimeout);
let driver: WebDriver;
let port: number;

beforeEach(async () => {

    port = await getFreePort();
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();
});

test('Test Network', async () => {

    const googlePage = new GooglePage(driver);

    const cdpClient = new CDPClient();
    const client = await cdpClient.init(port);
    const network = new Network(client, 'network.json');

    await network.startTrace();

    await driver.get("https://www.google.com");

    await googlePage.search('test');

    await network.stopTrace();
    await cdpClient.close();

});

afterEach(async () => {
    await driver.quit()
});