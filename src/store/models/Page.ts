import axe from 'axe-core';

export class Page {
  url: string;
  html?: any;
  ally?: axe.AxeResults;
  isCrawling?: boolean;

  constructor(params: any) {
    this.url = params.url;
    this.html = params.html;
    this.ally = params.ally;
    this.isCrawling = params.isCrawling || false;
  }
}
