import React, { useContext } from 'react';
import { IonList, IonListHeader, IonLabel, IonItem, IonBadge } from '@ionic/react';
import _ from 'lodash';
import axe from 'axe-core';
import { AppContext, Page } from '../../store';
import { ActionType } from '../../store/types';
import './styles.css';

interface PagePaneProps {
  page: Page
}

interface List {
  label: string;
  value: string;
  color: string;
}

const PagePane: React.FunctionComponent<PagePaneProps> = ({ page }) => {
  const { dispatch } = useContext<any>(AppContext);

  const listMap: List[] = [
    { label: 'Violations', value: 'violations', color: 'primary' },
    { label: 'Incomplete', value: 'incomplete', color: 'secondary' },
    { label: 'Inapplicable', value: 'inapplicable', color: 'tertiary' },
    { label: 'Passes', value: 'passes', color: 'success' },
  ];

  const setIssue = (issue: any) => {
    dispatch({ type: ActionType.SetIssue, payload: { issue } })
  }

  const generateList = (page: Page, list: List, index: number) => {
    const issues: axe.Result[] = _.get(page.ally, list.value);

    return (
      <IonList key={index} id={'section-' + list.value}>
        <IonListHeader>
          <IonLabel>
            {list.label}
          </IonLabel>
        </IonListHeader>
        {(issues||[]).map((issue: any, i: number) => (
          <IonItem lines="full" key={issue.id + i} onClick={() => setIssue(issue)}>
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
    <div className="result-pane">
      {listMap.map((list: List, index: number) => generateList(page, list, index))}
    </div>
  );
};

export default PagePane;
