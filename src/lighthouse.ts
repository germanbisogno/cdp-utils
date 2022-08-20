import { TraceOperations } from "./traceOperations";
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import { computeMedianRun } from 'lighthouse/lighthouse-core/lib/median-run.js';
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
        /**
         * NOTE: this is a temporary solution to allow itegrating Selenium or any other test framework with lighthouse without opening a new tab in the browser.
         * 
         * See related issues: 
         * https://github.com/GoogleChrome/lighthouse/issues/3837
         * https://github.com/GoogleChrome/lighthouse/issues/11313
         */
        const req = await axios.get(`http://${'localhost'}:${this._port}/json/version`);
        this._browser = await puppeteer.connect({
            browserWSEndpoint: req.data.webSocketDebuggerUrl,
        });

        const pages = await this._browser.pages();

        if (viewPort) {
            await pages[0].setViewport(viewPort);
        }

        this._flow = await startFlow(pages[0], {
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
    public async stopTrace(): Promise<RunnerResult[]> {
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
        await this._flow.snapshot({ stepName });
    }

}