import React, { createContext, useReducer, useEffect } from "react";
import _ from 'lodash';
import { Project, Page } from './models';
import { IState, ActionType, IAction, IContext } from './types';
import { get, store, upsert, pageLinks } from '../util';
import {
  saveProject
} from './actions';

const allProjects: Project[] = [];

export const initialState: IState = {
  projects: allProjects,
  project: null,
  page: null,
  issue: null,
  toast: {
    show: false,
    message: ''
  },
  loading: {
    show: false,
    message: undefined
  },
  modal: {
    show: false,
    component: undefined
  }
};

const AppContext = createContext<any>(initialState);

export const reducer = (state: IState, action: IAction) => {
  let newState: IState = state;
  switch (action.type) {
    /** App Actions */
    case ActionType.SetLoading: {
      newState = { ...state, loading: action.payload.loading };
      break;
    }
    case ActionType.ShowToast: {
      newState = { ...state, toast: action.payload.toast };
      break;
    }
    case ActionType.ShowModal: {
      newState = { ...state, modal: action.payload.modal };
      break;
    }

    /** Project Actions */
    case ActionType.SetProject: {
      newState = { ...state, project: action.payload.project }
      break;
    }
    case ActionType.UpdateProject: {
      const projects = upsert(state.projects, action.payload.project, 'id');
      newState = { ...state, projects, project: action.payload.project };
      break;
    }
    case ActionType.SaveProject: {
      newState = saveProject(state, action);
      break;
    }
    case ActionType.DeleteProject: {
      if (action.payload.project) {
        const projectToDelete = action.payload.project;
        const projects = state.projects.slice();
        const projectIndex = projects.findIndex((p: Project) => p.id === projectToDelete.id);

        projects.splice(projectIndex, 1);

        newState = {
          ...state,
          projects,
          project: null
        };
      }
      break;
    }

    /** Page Actions */
    case ActionType.SetPage: {
      if (state.project && state.project.pages && action.payload.page) {
        const url = action.payload.page.url;
        const pageIndex = state.project.pages.findIndex((p: Page) => p.url === url);

        newState = {
          ...state,
          page: pageIndex,
          issue: _.get(state, `project.pages.${pageIndex}.ally.violations.0`)
        };
        // ls
      }
      break;
    }

    case ActionType.UpdatePage: {
      if (state.projects.length && state.project && state.project.pages && action.payload.page) {
        const projects = state.projects.slice();
        const project = state.project;
        const projectIndex = projects.findIndex((p: Project) => p.id === project.id);

        const url = action.payload.page.url;
        const pageIndex = state.project.pages.findIndex((p: Page) => p.url === url);

        if (projectIndex > -1 && pageIndex > -1) {
          project.pages[pageIndex] = action.payload.page;
        }

        const links = pageLinks(action.payload.page.html, project.home);
        links.forEach((link: string) => {
          if (!project.pages.find((p: Page) => p.url.toLowerCase() === link.toLowerCase())) {
            project.pages.push({
              url: link,
            });
          }
        });

        projects[projectIndex] = project;

        newState = {
          ...state,
          projects,
          project: projects[projectIndex],
          issue: state.page !== pageIndex ? state.issue : _.get(state, `project.pages.${pageIndex}.ally.violations.0`)
        };
      }
      break;
    }

    case ActionType.CrawlPage: {
      if (state.project && state.project.pages && action.payload.page) {
        const url = action.payload.page.url;
        const pageIndex = state.project.pages.findIndex((p: Page) => p.url === url);
        state.project.pages[pageIndex].isCrawling = true;
      }
      newState = { ...state };
      break;
    }

    /** Issue Actions */
    case ActionType.SetIssue: {
      newState = { ...state, issue: action.payload.issue }
      break;
    }
  }

  store('state', newState);
  return newState;
}

const lsState: any = get('state');

function AppContextProvider(props: any) {
  const fullInitialState: IState = Object.assign(initialState, lsState);

  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(reducer, fullInitialState);
  const value: IContext = { state, dispatch };

  useEffect(() => {
    (window as any).ipcRenderer.on('crawl-reply', (event: any, args: any) => {
      const page: Page = {
        url: args.url,
        html: args.html,
        ally: args.results,
        isCrawling: false,
      };
      dispatch({ type: ActionType.UpdatePage, payload: { page } });
    });
  }, [dispatch]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
