import * as LH from 'lighthouse';
import { FlowResult, startFlow, UserFlow } from 'lighthouse';
import { TraceOperations } from './traceOperations';
import * as fs from 'fs';
import puppeteer from 'puppeteer';
import axios from 'axios';

export class Lighthouse extends TraceOperations {
  private _flow: UserFlow;
  private _report: string;
  private _port: number;
  private _browser: puppeteer.Browser | undefined;

  constructor(port: number) {
    super();
    this._port = port;
  }

  /**
   * Initializes a lighthouse workflow
   *
   * @param name workflow name
   * @param config lighthouse configuration
   * @param viewPort (optional) view port settings
   */

  public async initWorkFlow(
    name: string,
    config?: LH.Config,
    viewPort?: puppeteer.Viewport
  ) {
    /**
     * NOTE: this is a temporary solution to allow itegrating Selenium or any other test framework with lighthouse without opening a new tab in the browser.
     *
     * See related issues:
     * https://github.com/GoogleChrome/lighthouse/issues/3837
     * https://github.com/GoogleChrome/lighthouse/issues/11313
     */
    const req = await axios.get(
      `http://${'localhost'}:${this._port}/json/version`
    );
    this._browser = await puppeteer.connect({
      browserWSEndpoint: req.data.webSocketDebuggerUrl,
    });

    const pages = await this._browser.pages();

    if (viewPort) {
      await pages[0].setViewport(viewPort);
    }

    this._flow = await startFlow(pages[0], {
      name,
      config,
      // to prevent Lighthouse from changing the screen dimensions.
      flags: { screenEmulation: { disabled: true } },
    });
  }

  /**
   * Starts the trace wrapping startTimespan from lighthouse
   * @param stepName string step name
   */
  public async startTrace(stepName?: string): Promise<void> {
    await this._flow.startTimespan({ name: stepName });
  }

  /**
   * Navigates to a url using lighthouse
   * @param url url to navigate
   * @param stepName string step name
   */
  public async navigate(url: string, stepName?: string): Promise<void> {
    return this._flow.navigate(url, { name: stepName });
  }

  /**
   * Stop tracing wrapping endTimespan from lighthouse and return lighthouse flow report
   * @returns LH Runner results
   */
  public async stopTrace(): Promise<FlowResult.Step[]> {
    await this._flow.endTimespan();
    const results = await this._flow.createFlowResult();
    return results.steps;
  }

  /**
   * Generates the flow report
   * @param fileName name of the report file
   */
  public async generateFlowReport(fileName: string): Promise<void> {
    this._report = await this._flow.generateReport();
    fs.writeFileSync(fileName, this._report);
  }

  /**
   * Takes a snapshot of the current status of the page
   * @param stepName name of the step
   */
  public async snapshot(stepName?: string): Promise<void> {
    await this._flow.snapshot({ name: stepName });
  }
}
