import React, { useContext, useState } from 'react';
import { IonGrid, IonRow, IonCol, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip } from '@ionic/react';
import { arrowBack, arrowForward, shareAlt } from 'ionicons/icons';
import { AppContext } from '../../store';
import Code from '../Code';
import BrowserLink from '../BrowserLink';
import './styles.scss';

interface IssuePaneProps {
  show?: boolean
}

const IssuePane: React.FunctionComponent<IssuePaneProps> = (props) => {
  const { state } = useContext<any>(AppContext);
  const [page, changePage] = useState(0);
  const { issue } = state;

  if (!props.show || !issue) {
    return null;
  }

  const next = () => {
    if (page < (issue.nodes.length - 1)) {
      changePage(page + 1);
    }
  }

  const prev = () => {
    if (page > 0) {
      changePage(page - 1);
    }
  }

  const getNodeIssue = (page: number) => {
    const node = issue.nodes[page];

    if (!node) {
      return false;
    }

    return (
      <div>
        {node.target &&
          <div className="node-issue-section">
            <h2>Element Location</h2>
            <Code code={(node.target || []).join(' ')} lang="css" />
          </div>
        }

        {node.html &&
          <div className="node-issue-section">
            <h2>Element Source</h2>
            <Code code={node.html} />
          </div>
        }

        {node.failureSummary &&
          <div className="node-issue-section">
            <h2>Solution</h2>
            <p dangerouslySetInnerHTML={{ __html: node.failureSummary.replace('\n', '<br/>') }} />
          </div>
        }
      </div>
    )
  }

  const nodeIssueCard = () => {
    if (issue.nodes && issue.nodes.length) {
      return (
        <IonRow className="issue-pane-nodes">
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Occurrences</IonCardTitle>
                {issue.nodes.length > 1 &&
                  <div className="paginator">
                    <div className="paginator-prev" onClick={() => prev()}>
                      <IonIcon color="light" icon={arrowBack} />
                    </div>
                    <div className="paginator-current">
                      <span>{page + 1} / {issue.nodes.length}</span>
                    </div>
                    <div className="paginator-next" onClick={() => next()}>
                      <IonIcon color="light" icon={arrowForward} />
                    </div>
                  </div>
                }
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      {getNodeIssue(page)}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      );
    }
  }

  return (
    <div className="issue-pane">
      <IonGrid no-padding={true}>
        <IonRow className="issue-pane-header">
          <IonCol size="10" className="issue-pane-heading">
            <h3>{issue.help}</h3>
          </IonCol>
          <IonCol className="issue-pane-impact" size="2">
            {issue.impact && <p>Impact: {issue.impact}</p>}
            {issue.helpUrl &&
              <BrowserLink size="small" fill="clear" href={issue.helpUrl} useButton={true}>
                Learn More
                <IonIcon slot="end" icon={shareAlt} />
              </BrowserLink>
            }
          </IonCol>
        </IonRow>
        <IonRow className="issue-pane-description">
          <IonCol>
            <h4>Issue Description</h4>
            <p>{issue.description}</p>

            <div className="tag-list">
              {issue.tags.map((tag: any, index: number) => (
                <IonChip color="medium" key={index}>
                  {tag}
                </IonChip>
              ))}
            </div>
          </IonCol>
        </IonRow>

        {nodeIssueCard()}
      </IonGrid>
    </div>
  );
};

IssuePane.defaultProps = {
  show: true
};

export default IssuePane;
