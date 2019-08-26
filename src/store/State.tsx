import React, { createContext, useReducer } from "react";
import _ from 'lodash';
import { Project } from './models';
import { IState, ActionType, IAction, IContext, StateViewType, StateModeType } from './types';
import { get, store, upsert } from '../util';
import {
  saveProject
} from './actions';

const allProjects: Project[] = [];

export const initialState: IState = {
  projects: allProjects,
  project: null,
  page: null,
  issue: null,
  view: StateViewType.Form,
  mode: StateModeType.New,
  toast: {
    show: false,
    message: ''
  },
  loading: {
    show: false,
    message: undefined
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

    /** TODO::DeleteProject */

    /** Page Actions */
    case ActionType.SetPage: {
      newState = {
        ...state,
        page: action.payload.page,
        issue: _.get(state, `project.pages.${action.payload.page}.ally.violations.0`)
      };
      break;
    }

    /** TODO::DeletePage */

    case ActionType.CrawlPage: {
      if (state.project && state.project.pages) {
        state.project.pages[action.payload.page].isCrawling = true;
      }
      newState = { ...state };
      break;
    }
    case ActionType.CrawlPageDone: {
      if (state.project && state.project.pages) {
        state.project.pages[action.payload.page].isCrawling = false;
      }
      newState = {
        ...state,
        page: action.payload.page,
        issue: _.get(state, `project.pages.${action.payload.page}.ally.violations.0`)
      };
      break;
    }

    /** Issue Actions */
    case ActionType.SetIssue: {
      newState = { ...state, issue: action.payload.issue }
      break;
    }
  }

  console.log(action.type);
  store('state', newState);
  return newState;
}

const lsState: any = get('state');

function AppContextProvider(props: any) {
  const fullInitialState: IState = Object.assign(initialState, lsState);

  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(reducer, fullInitialState);
  const value: IContext = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
