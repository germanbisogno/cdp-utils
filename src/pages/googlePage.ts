import { By, WebDriver, Key } from "selenium-webdriver";
import { elementLocated } from "selenium-webdriver/lib/until";
import { config } from "../config/config";

export class GooglePage {
    private _driver: WebDriver;
    private searchBoxLoc: By = By.name('q');

    constructor(driver: WebDriver) {
        this._driver = driver;
    }

    async search(criteria: string): Promise<void> {
        await this._driver.wait(elementLocated(this.searchBoxLoc), config.maxTimeout);
        const el = await this._driver.findElement(this.searchBoxLoc);
        await el.sendKeys(criteria);
        await el.sendKeys(Key.RETURN);
    }
}