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
    let severitySortedIssues: any[]|null = null;
    if (list.label === 'Violations' || list.label === 'Incomplete') {
      const criticalIssues = issues.filter((issue: any) => issue.impact === 'critical');
      severitySortedIssues = issues.sort((a: any, b: any) => a.impact > b.impact ? -1 : 1);
      // Once more thing to get criticals in the front
      severitySortedIssues = [
        ...criticalIssues,
        ...severitySortedIssues.filter(issue => issue.impact !== 'critical')
      ];
    }
    const currentListIssues = severitySortedIssues || issues;

    const getClass = (issue: axe.Result) => {
      let impactClass = '';
      if (issue.impact) {
        impactClass = `impact--${issue.impact}`
      }

      return activeIssue.id === issue.id ? `u-active ${impactClass}` : `${impactClass}`;
    }

    return (
      <IonList key={index} id={'section-' + list.value}>
        <IonListHeader>
          <IonLabel>
            {list.label}
          </IonLabel>
        </IonListHeader>
        {(currentListIssues||[]).map((issue: any, i: number) => (
          <IonItem
            lines="full"
            key={issue.id + i}
            onClick={() => setIssue(issue)}
            className={getClass(issue)}
          >
            <IonLabel text-wrap={true}>
              <h3>{issue.help}</h3>
              {issue.impact && <p className='impact'><span className={`issue issue--${issue.impact.toLowerCase()}`}>{issue.impact}</span></p>}
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
