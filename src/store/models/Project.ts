import * as uuid from 'uuid';
import { Page } from './Page';

export interface Tag {
  label: string;
  value: string;
  checked: boolean;
}

export interface ResultType {
  label: string;
  value: string;
  checked: boolean;
  color?: string;
}

const defaultTags: Tag[] = [
  { label: 'Best Practice', value: 'best-practice', checked: true },
  { label: 'WCAG A', value: 'wcag2a', checked: true },
];

const defaultResultTypes = [
  { label: 'Violations', value: 'violations', checked: true, color: 'primary' },
  { label: 'Incomplete', value: 'incomplete', checked: true, color: 'secondary' },
  { label: 'Inapplicable', value: 'inapplicable', checked: true, color: 'tertiary' },
  { label: 'Passes', value: 'passes', checked: true, color: 'success' },
]

export class Project {
  id?: string;
  name: string;
  tags: Tag[];
  resultTypes: ResultType[];
  useJs?: boolean;
  home: string;
  numPages: number;
  pages?: Page[];
  timestamp: Date;

  constructor(params: any) {
    this.id = params.id || uuid.v4();
    this.name = params.name || 'Crawl Report';
    this.tags = params.tags || defaultTags;
    this.resultTypes = params.resultTypes || defaultResultTypes;
    this.pages = params.pages || [];
    this.timestamp = params.timestamp || (new Date()).toDateString();
    this.useJs = params.useJs || true;
    this.home = params.home;
    this.numPages = params.numPages || 1;
  }
}
