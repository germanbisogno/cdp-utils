import { TraceOperations } from "./traceOperations";
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api.js';
import { RunnerResult } from 'lighthouse/types/externs'
import * as fs from 'fs';
import puppeteer from "puppeteer";
import axios from 'axios';

export class Lighthouse extends TraceOperations {
    private _flow: any;
    private _report: any;
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

    public async initWorkFlow(name: string, config: any, viewPort?: puppeteer.Viewport) {
        const page = await this.getFirstPage('localhost');
        if (viewPort) {
            await page.setViewport(viewPort);
        }
        this._flow = await startFlow(page, {
            name, configContext: {
                settingsOverrides: config
            }
        });
    }

    /**
     * Starts the trace wrapping startTimespan from lighthouse
     * @param stepName 
     */
    public async startTrace(stepName?: string): Promise<void> {
        await this._flow.startTimespan({ stepName });
    }

    /**
     * Navigates to a url using lighthouse
     * @param url url to navigate
     * @param stepOptions { stepName?: string }
     */
    public async navigate(url: string, stepOptions?: { stepName?: string }): Promise<void> {
        await this._flow.navigate(url, stepOptions);
    }

    /**
     * Stop tracing wrapping endTimespan from lighthouse and return lighthouse flow report
     * @returns LH Runner results
     */
    public async stopTrace(): Promise<RunnerResult> {
        return this._flow.endTimespan();
    }

    /**
     * Generates the flow report
     * @param fileName name of the report file
     */
    public generateFlowReport(fileName: string): void {
        this._report = this._flow.generateReport();
        fs.writeFileSync(fileName, this._report);
    }

    /**
     * Takes a snapshot of the current status of the page
     * @param stepName name of the step
     */
    public async snapshot(stepName?: string): Promise<void> {
        await this._flow.snapshot({ stepName });
    }

    /**
     * Gets the first page, required to start the flow
     * 
     * @param hostName name of the host to find out the webSocketDebuggerUrl
     * @returns a puppeteer Page
     */
    private async getFirstPage(hostName: string): Promise<puppeteer.Page> {
        /**
         * NOTE: this is a temporary solution to allow itegrating Selenium or any other test framework with lighthouse without opening a new tab in the browser.
         * 
         * See related issues: 
         * https://github.com/GoogleChrome/lighthouse/issues/3837
         * https://github.com/GoogleChrome/lighthouse/issues/11313
         */
        const req = await axios.get(`http://${hostName}:${this._port}/json/version`);
        this._browser = await puppeteer.connect({
            browserWSEndpoint: req.data.webSocketDebuggerUrl,
        });

        const pages = await this._browser.pages();

        return pages[0];
    }
}