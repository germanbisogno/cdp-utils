# CDP Utils

### A set of utilities/wrapper for Test Automation or Performance testing on top of Chrome DevTools Protocol [CDP](https://chromedevtools.github.io/devtools-protocol/)

<p align="center">
  <img src="images/Basic-Diagram.png" />
</p>

## Inspiration

It has been inspired in the power of CDP to interact with the browser like you would do using chrome dev tools but programmatically, **this library is independent of any test automation framework** since it talks directly with chrome using `--remote-debugging-port` commonly 9222 port.  There are situations when we need to emulate or collect information from the browser during the execution of e2e tests.  This lib intends to be an utility for testing purposes without the need to program each functionality.

More inpiration has been based on existing tools that are using this protocol like [puppeteer](https://github.com/puppeteer/puppeteer), see https://puppeteer.github.io/puppeteer/docs/puppeteer.tracing

## Important

It is not a replacement of any actual tool or library, instead it is just a wrapper with common utilities for Test Automation or Performance testing. For example Selenium 4 introduces a new powerful API which grants access to Chrome DevTools directly from your automated tests just accessing it by `driver.getDevTools();`, this is another way to use CDP programmatically in your scripts.  It can be used also by importing directly `chrome-remote-interface` like this project is referencing in its package.json. 

You are very welcome if you feel that can contribute with more utilities to take advantaje of this great API.

## Usage

### Tracing

The following example shows how to use the Tracing class with Selenium Webdriver.

```js

import { CDPClient, Tracing } from "cdp-utils";

test('Test tracing', async () => {
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);

    // Initializes the CDP client connection
    const cdpClient = new CDPClient();
    const client = await cdpClient.init(port);

    // Instantiates the class and produces a file as result of the trace
    const tracing = new Tracing(client, 'trace.json');

    // start tracing
    await tracing.startTrace();

    // here you perform your test steps

    // stop tracing
    const trace = await tracing.stopTrace();

    // do whatever with trace

    // Close the CDP client connection
    await cdpClient.close()

    await driver.quit();

}

```

### Performance

An example using the Performance class with Selenium Webdriver.

```js

import { CDPClient, Performance } from "cdp-utils";

test('Test performance', async () => {
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);
    
    // Initializes the CDP client connection
    const cdpClient = new CDPClient();
    const client = await cdpClient.init(port);
    
    // Instantiates the class and produces two files as result of the trace
    const performance = new Performance(client, 'startTrace.json', 'endTrace.json');

    // start tracing
    const perfStartResults = await performance.startTrace();

    await driver.get("https://www.google.com");

    await googlePage.search('test');

    const perfEndResults = await performance.stopTrace();

    // Perform assertions or do whatever with perfStartResults or perfEndResults

    // Close the CDP client connection
    await cdpClient.close()

    await driver.quit();
}

```

### Lighthouse

An example using the Lighthouse class with Selenium Webdriver.  Notice that it combines lighthouse/puppeteer in order to initialize the workflow with the configuration required and navigate to the first page.

```js

import { CDPClient, Lighthouse } from "cdp-utils";

test('Test performance', async () => {
    const options = new chrome.Options();

    options.addArguments(`--remote-debugging-port=${port}`);

    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const googlePage = new GooglePage(driver);
    
    const lighthouse = new Lighthouse(port);

    await lighthouse.initWorkFlow('Google search', {
        formFactor: 'desktop',
        screenEmulation: {
            mobile: false,
            width: 900,
            height: 1600,
            deviceScaleFactor: 1,
            disabled: false,
        },
        emulatedUserAgent: DESKTOP_USERAGENT,
        throttlingMethod: 'provided',
        throttling: {
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
        }
    })

    await lighthouse.navigate("https://www.google.com");

    await lighthouse.startTrace('search operation');

    await googlePage.search('test');

    const res = await lighthouse.stopTrace();

    lighthouse.generateFlowReport('lighthouse.html');

    await driver.quit();
    
    // make assertions using RunnerResult
    expect(res.lhr.categories.performance.score).toBeGreaterThan(0.8);

}

```

## Install

```sh

npm install

```

## Build

```sh

npm run build

```
## Run tests

```sh

npm run test

```

## Classes diagram

<p align="center">
  <img src="images/src_diagram.png" />
</p>
