import { By, WebDriver } from "selenium-webdriver";
import { elementIsVisible } from "selenium-webdriver/lib/until";

export class GooglePage {
    private _driver: WebDriver;
    private searchBoxLoc: By = By.name('q');
    private buttonLoc: By = By.name('btnK');

    constructor(driver: WebDriver) {
        this._driver = driver;
    }

    async search(criteria: string): Promise<void> {
        const el = await this._driver.findElement(this.searchBoxLoc);
        await el.sendKeys(criteria);

        const button = await this._driver.findElement(this.buttonLoc);

        await this._driver.wait(elementIsVisible(button));
        await button.click();
    }
}