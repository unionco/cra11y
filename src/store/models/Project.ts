import * as uuid from 'uuid';
import { Page } from './Page';

export class Project {
  id?: string;
  name?: string;
  tags?: string[];
  useJs?: boolean;
  home: string;
  numPages: number;
  pages?: Page[];
  timestamp: Date;

  constructor(params: any) {
    this.id = params.id || uuid.v4();
    this.name = params.name || 'Crawl Report';
    this.tags = params.tags || ['wcag2a', 'best-practice'];
    this.pages = params.pages || [];
    this.timestamp = params.timestamp || (new Date()).toDateString();
    this.useJs = params.useJs || true;
    this.home = params.home;
    this.numPages = params.numPages || 1;
  }
}
