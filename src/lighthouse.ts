import { TraceOperations } from "./traceOperations";
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api.js';
import * as fs from 'fs';
import * as puppeteer from "puppeteer";
import axios from 'axios';

export class Lighthouse extends TraceOperations {
    private _traceFileName: string;
    private _flow: any;
    private _report: any;
    private _port: number;
    private _browser: puppeteer.Browser | undefined;

    constructor(port: number, traceFileName: string = '') {
        super();
        this._port = port;
        this._traceFileName = traceFileName;
    }

    public async initWorkFlow(name: string, config: any) {
        const page = await this.getFirstPage('localhost');
        await page.setViewport({ "width": 900, "height": 1600 })
        this._flow = await startFlow(page, {
            name, configContext: {
                settingsOverrides: config
            }
        });
    }

    public async startTrace(stepName?: string): Promise<void> {
        await this._flow.startTimespan({ stepName });
    }

    public async navigate(url: string): Promise<void> {
        await this._flow.navigate(url);
    }

    public async stopTrace(): Promise<any> {
        return this._flow.endTimespan();
    }

    public generateReport(): void {
        if (this._traceFileName) {
            this._report = this._flow.generateReport();
            fs.writeFileSync(this._traceFileName, this._report);
        }
    }

    public async snapshot(stepName?: string): Promise<void> {
        await this._flow.snapshot({ stepName });
    }

    private async getFirstPage(hostName: string): Promise<puppeteer.Page> {
        const req = await axios.get(`http://${hostName}:${this._port}/json/version`);
        this._browser = await puppeteer.connect({
            browserWSEndpoint: req.data.webSocketDebuggerUrl,
        });

        const pages = await this._browser.pages();

        return pages[0];
    }
}