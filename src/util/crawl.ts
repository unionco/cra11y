// import { ipcRenderer } from 'electron';
import { Page, Project } from '../store/models';
import { Dispatch } from 'react';

export function crawl(url: string, project: Project): Promise<any> {
  return new Promise((resolve, reject) => {
    (window as any).ipcRenderer.on('crawl-reply', (event: any, args: any) => {
      const page: Page = {
        url: args.url,
        html: args.html,
        ally: args.results
      };
      resolve(page);
    });

    (window as any).ipcRenderer.on('crawl-error', (event: any, args: any) => {
      console.log('crawl-error', event, args);
      reject(args.error);
    });

    (window as any).ipcRenderer.send('crawl-async', {
      url,
      useJs: project.useJs,
      tags: (project.tags || []).map(t => t.value),
      resultTypes: (project.resultTypes || []).map(t => t.value)
    });
  })
}

export function crawler(pages: Page[], numPages: number, useJs: boolean, dispatch: Dispatch<any>) {

}
