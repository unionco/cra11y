const puppeteer = require('puppeteer');
const axios = require('axios');
const axeCore = require('axe-core');

function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

const webpage = async (options) => {
  const { url, useJs = false } = options;
  let html = '';
  let results = null;

  if (useJs) {
    // use puppeteer
    const browser = await puppeteer.launch({
      executablePath: getChromiumExecPath()
    });

    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2' });

      html = await page.evaluate(() => document.documentElement.innerHTML);

      const handle = await page.evaluateHandle(`
        // Inject axe source code
        ${axeCore.source}
        // Run axe
        axe.run()
      `);

      results = await handle.jsonValue();

      await handle.dispose();

    } catch (error) {
      return error;
    }

    await browser.close();

    return {
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
