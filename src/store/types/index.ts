import { Dispatch } from 'react';
import { Project } from '../models';

export enum ActionType {
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
  CrawlPage = 'crawlPage',
  CrawlPageDone = 'crawlPageDone',
  CrawlProject = 'crawlProject',
  CrawlComplete = 'crawlComplete',
  CrawlCancelled = 'crawlCancelled',
  ShowToast = 'showToast'
}

export enum StateModeType {
  New = 'new',
  Edit = 'edit'
}

export enum StateViewType {
  Form = 'form',
  Project = 'project',
  Crawling = 'crawling'
}

export interface IToast {
  show: boolean;
  message: string;
}

export interface ILoading {
  show: boolean;
  message?: string;
}

export interface IAction {
  type: ActionType;
  payload: {
    project: Project, // active project
    page: number; // page index
    issue: any; // issue index
    view: StateViewType;
    mode: StateModeType,
    toast: IToast,
    loading: ILoading
  };
}

export interface IState {
  projects: Project[];
  project?: Project|null;
  page?: number|null;
  issue?: number|null;
  view: StateViewType;
  mode: StateModeType;
  toast?: IToast,
  loading?: ILoading
};

export interface IContext {
  state: IState;
  dispatch: Dispatch<IAction>;
}
