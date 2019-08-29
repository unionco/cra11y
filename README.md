# Cra11y

An open source web a11y crawling tool using [Electron](https://electronjs.org), [React](https://reactjs.org), and [Axe](https://www.deque.com/axe) built by [Union](https://union.co).

## Quick Start

* `git clone https://github.com/unionco/cra11y.git`
* `cd cra11y && yarn install`

To run locally and have live reload
* `yarn run electron-dev`

To build and package mac app
* `yarn run electron-pack`

## Concepts

Postman or Insomnia + A11y tooling. This MacOS app is using Create React App and Electron to create a seemless UI to crawl and audit accessibilty rules on an entire websites. It uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) to be able to run javascript to get the best possible audit results.


### Project
A project contains a name, home url, number of pages to initially crawl and analyze, and some axe related settings. In the future we would like to provide a way to upload a settings.json file with all axe related possible configuration. Once crawled and analyzed, projects will have an array of pages along with their results.

### Page
A page contains the following:

* Url
* A11y
  * Tool Options
  * Test Engine
  * Test Runner
  * Test Environment
  * Url
  * Timestamp
  * Passes
  * Violations
  * Incomplete
  * Inapplicable
* Html

### Issue
* Description
* Help
* HelpUrl
* Id
* Impact
* Tags
* Nodes
  * Html
  * Impact
  * Target
  * Xpath
  * Any
  * All
  * None
  * Failure Summary

To learn more about the Axe Result, click [here](https://github.com/dequelabs/axe-core/blob/master/doc/API.md).
