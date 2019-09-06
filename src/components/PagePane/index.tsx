import React, { useState } from 'react';
import { IonList, IonListHeader, IonLabel, IonItem, IonBadge, IonCol } from '@ionic/react';
import _ from 'lodash';
import axe from 'axe-core';
import { Page, Project } from '../../store';
import { ResultType } from '../../store/models/Project';
import IssuePane from '../IssuePane';
import './styles.css';
import { store, get } from '../../util';

interface PagePaneProps {
  page: Page,
  project: Project
}

const PagePane: React.FunctionComponent<PagePaneProps> = ({ project, page }) => {
  const listMap: ResultType[] = project.resultTypes || [];

  // get active issue from store
  const storedIssue: any = get(`${project.id}.${page.url}.issue`);
  const resultList = _.get(page, `ally.${listMap[0].value}`);
  const [activeIssue, setActiveIssue] = useState(storedIssue || resultList[0]);

  const setIssue = (issue: any) => {
    store(`${project.id}.${page.url}.issue`, issue);
    setActiveIssue(issue);
  }

  const generateList = (page: Page, list: ResultType, index: number) => {
    const issues: axe.Result[] = _.get(page.ally, list.value);

    const getClass = (issue: axe.Result) => {
      return activeIssue.id === issue.id ? 'u-active' : '';
    }

    return (
      <IonList key={index} id={'section-' + list.value}>
        <IonListHeader>
          <IonLabel>
            {list.label}
          </IonLabel>
        </IonListHeader>
        {(issues||[]).map((issue: any, i: number) => (
          <IonItem lines="full" key={issue.id + i} onClick={() => setIssue(issue)} className={getClass(issue)}>
            <IonLabel text-wrap={true}>
              <h3>{issue.help}</h3>
              {issue.impact && <p>Impact: {issue.impact}</p>}
            </IonLabel>
            <IonBadge mode="ios" slot="end" color={list.color}>
              <IonLabel>
                {issue.nodes.length}
              </IonLabel>
            </IonBadge>
          </IonItem>
        ))}
      </IonList>
    );
  }

  return (
    <>
      <IonCol size="4">
        <div className="result-pane">
          {listMap.map((list: ResultType, index: number) => generateList(page, list, index))}
        </div>
      </IonCol>
      <IonCol size="8">
        {activeIssue &&
          <IssuePane
            issue={activeIssue}
          />
        }
      </IonCol>
    </>
  );
};

export default PagePane;
