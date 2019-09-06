import { Dispatch } from 'react';
import { Project, Page } from '../models';

export enum ActionType {
  ShowModal = 'showModal',
  SetLoading = 'setLoading',
  SetProject = 'setProject',
  SaveProject = 'saveProject',
  UpdateProject = 'updateProject',
  EditProject = 'editProject',
  DeleteProject = 'deleteProject',
  UpsertProject = 'upsertProject',
  SetView = 'setView',
  SetMode = 'setMode',
  SetIssue = 'setIssue',
  SetPage = 'setPage',
  UpdatePage = 'updatePage',
  CrawlPage = 'crawlPage',
  CrawlPageDone = 'crawlPageDone',
  CrawlProject = 'crawlProject',
  CrawlComplete = 'crawlComplete',
  CrawlCancelled = 'crawlCancelled',
  ShowToast = 'showToast'
}

export interface IToast {
  show: boolean;
  message: string;
}

export interface ILoading {
  show: boolean;
  message?: string;
}

export interface IModal {
  show: boolean;
  component: any;
}

export interface IAction {
  type: ActionType;
  payload: {
    project?: Project, // active project
    page?: Page; // page index
    issue?: any; // issue index
    toast?: IToast;
    loading?: ILoading;
    modal?: IModal;
  };
}

export interface IState {
  projects: Project[];
  project?: Project|null;
  page?: number|null;
  issue?: number|null;
  toast?: IToast;
  loading?: ILoading;
  modal?: IModal;
};

export interface IContext {
  state: IState;
  dispatch: Dispatch<IAction>;
}
