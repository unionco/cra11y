import React, { useContext, useEffect } from "react";
import { IonHeader, IonCol, IonRow, IonGrid, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { Redirect } from "../../util/router";
import './styles.scss';
import { AppContext, Project, Page } from "../../store";
import { ActionType } from "../../store/types";
import PagePane from "../../components/PagePane";
import IssuePane from "../../components/IssuePane";
import Analyze from "../../components/Analyze";
import { crawl } from "../../util";
import { ResultType } from "../../store/models/Project";

interface List {
  label: string;
  value: string;
  color: string;
}

const ProjectPage: React.FunctionComponent<any> = ({ match: { params }, ...props }) => {
  const { state, dispatch } = useContext<any>(AppContext);
  const project = state.projects.find((project: Project) => project.id === params.project);

  const listMap: List[] = [
    { label: 'Violations', value: 'violations', color: 'primary' },
    { label: 'Incomplete', value: 'incomplete', color: 'secondary' },
    { label: 'Inapplicable', value: 'inapplicable', color: 'tertiary' },
    { label: 'Passes', value: 'passes', color: 'success' },
  ];

  /** Set it once on load */
  useEffect(() => {
    if (project) {
      dispatch({ type: ActionType.SetProject, payload: { project } });
    }

    if (!state.page) {
      dispatch({ type: ActionType.SetPage, payload: { page: 0 } });
    }
  }, [dispatch, state.page, project]);

  /** project redirect */
  if (!project) {
    return (
      <Redirect to="/projects" />
    )
  }

  const page = project.pages[state.page || 0];

  const analyze = async () => {
    const { project } = state;
    const pageIndex = project.pages.findIndex((p: Page) => p.url === page.url);
    dispatch({ type: ActionType.CrawlPage, payload: { page: pageIndex } });

    const response = await crawl(page.url, state.project);
    project.pages[pageIndex] = response;

    dispatch({ type: ActionType.UpdateProject, payload: { project } });
    dispatch({ type: ActionType.CrawlPageDone, payload: { page: pageIndex } });
  }

  const getContent = () => {
    if (page && page.ally) {
      return (
        <>
          <IonCol size="4">
            <PagePane project={state.project} page={page} />
          </IonCol>
          <IonCol size="8">
            <IssuePane />
          </IonCol>
        </>
      );
    }

    return (
      <>
        <Analyze
          page={page}
          analyze={analyze}
        />
      </>
    );
  }

  const scrollTo = (section: string) => {
    const el: HTMLElement|null = document.querySelector(`#section-${section}`);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  return (
    <div className="ProjectPage">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <h2>{page.url}</h2>
            <p>{project.timestamp}</p>
          </IonTitle>
          {state.project && page.ally &&
            <div className="ProjectPage-scores" slot="end">
              {state.project.resultTypes.map((type: ResultType, index: number) => (
                <IonButton shape="round" key={index} color={type.color} className="ProjectPage-score" onClick={() => scrollTo(type.value)}>
                  {page.ally[type.value].length}
                </IonButton>
              ))}
            </div>
          }
        </IonToolbar>
      </IonHeader>
      <IonGrid>
        <IonRow>
          {getContent()}
        </IonRow>
      </IonGrid>
    </div>
  );
}

export default ProjectPage;
