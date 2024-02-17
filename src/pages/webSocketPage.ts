import { By, WebDriver, Key } from 'selenium-webdriver';
import { elementLocated } from 'selenium-webdriver/lib/until';
import { cdpConfig } from '../config/cdpConfig';

export class WebSocketPage {
  private _driver: WebDriver;
  private message: By = By.name('message');

  constructor(driver: WebDriver) {
    this._driver = driver;
  }

  async sendMessage(message: string): Promise<void> {
    const el = await this._driver.wait(
      elementLocated(this.message),
      cdpConfig.maxTimeout
    );
    await el.sendKeys(message);
    await el.sendKeys(Key.RETURN);
  }
}
