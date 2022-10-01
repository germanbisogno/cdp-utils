import { By, WebDriver, Key } from "selenium-webdriver";
import { elementLocated } from "selenium-webdriver/lib/until";
import { cdpConfig } from "../config/cdpConfig";

export class GooglePage {
    private _driver: WebDriver;
    private searchBoxLoc: By = By.name('q');

    constructor(driver: WebDriver) {
        this._driver = driver;
    }

    async search(criteria: string): Promise<void> {
        await this._driver.wait(elementLocated(this.searchBoxLoc), cdpConfig.maxTimeout);
        const el = await this._driver.findElement(this.searchBoxLoc);
        await el.sendKeys(criteria);
        await el.sendKeys(Key.RETURN);
    }

    async searchFromClipboard(): Promise<void> {
        await this._driver.executeScript("await navigator.clipboard.writeText('test');");
        const criteria: string = await this._driver.executeScript<string>('return await navigator.clipboard.readText();');
        await this.search(criteria);
    }    
}