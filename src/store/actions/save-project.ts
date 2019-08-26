import _ from 'lodash';
import { IAction, IState } from "../types";
import { upsert } from '../../util';

export function saveProject(oldState: IState, action: IAction) {
  const projects = upsert(oldState.projects, action.payload.project, 'id');

  return {
    ...oldState,
    project: action.payload.project,
    projects,
    page: 0,
    issue: _.get(action.payload.project, 'pages.0.ally.violations.0')
  };
}
