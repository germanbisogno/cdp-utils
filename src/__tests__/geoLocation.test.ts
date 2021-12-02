import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import 'chromedriver';
import { CDPClient } from "../cdpClient";
import { GooglePage } from '../pages/googlePage';
import { GeoLocation } from '../geoLocation';
import { config } from "../config/config";

const options = new chrome.Options();

options.addArguments(`--remote-debugging-port=${config.cdpPort}`);

jest.setTimeout(config.maxTimeout);

test('Test Geolocation', async () => {
    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    const client = await CDPClient.init();

    const geoLocation = new GeoLocation(client);
    await geoLocation.emulateGeoLocation({
        accuracy: 100,
        latitude: 35.689487,
        longitude: 139.691706,
    });
    await driver.get("https://www.google.com");

    await googlePage.search('test');

    await CDPClient.close();

    await driver.quit();
});