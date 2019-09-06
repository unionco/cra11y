const puppeteer = require('puppeteer');
const axios = require('axios');
const axeCore = require('axe-core');

function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

const webpage = async ({
  url,
  useJs = false,
  tags = ['wcag2a', 'best-practice'],
  resultTypes = ['violations', 'incomplete', 'inapplicable', 'passes'],
}) => {
  let page = null;
  let html = '';
  let results = null;
  let runConfig = {};

  if (useJs) {
    // use puppeteer
    const browser = await puppeteer.launch({
      executablePath: getChromiumExecPath()
    });

    try {
      page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2' });

      html = await page.evaluate(() => document.documentElement.innerHTML);

      runConfig = {
        runOnly: {
          type: 'tag',
          values: tags,
        },
        resultTypes: resultTypes
      }
      const handle = await page.evaluateHandle(`
        // Inject axe source code
        ${axeCore.source}
        // Run axe
        axe.run(${JSON.stringify(runConfig)})
      `);

      results = await handle.jsonValue();

      await handle.dispose();

    } catch (error) {
      return error;
    }

    await page.close();
    await browser.close();

    return {
      url: url,
      html: html,
      results: results
    };
  }

  const opts = {
    responseType: 'text',
  };

  try {
    const remoteResponse = await axios.get(url, opts);
    return remoteResponse.data;
  } catch (error) {
    return error;
  }
}

module.exports = webpage;
