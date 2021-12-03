import { By, WebDriver } from "selenium-webdriver";
import { elementIsVisible, elementLocated } from "selenium-webdriver/lib/until";
import { config } from "../config/config";

export class GooglePage {
    private _driver: WebDriver;
    private searchBoxLoc: By = By.name('q');
    private buttonLoc: By = By.name('btnK');

    constructor(driver: WebDriver) {
        this._driver = driver;
    }

    async search(criteria: string): Promise<void> {
        await this._driver.wait(elementLocated(this.searchBoxLoc), config.maxTimeout);
        const el = await this._driver.findElement(this.searchBoxLoc);
        await el.sendKeys(criteria);

        const button = await this._driver.wait(elementLocated(this.buttonLoc), config.maxTimeout);
        await this._driver.wait(elementIsVisible(button), config.maxTimeout);

        await button.click();
    }
}