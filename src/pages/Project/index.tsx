import React, { useContext, useEffect } from "react";
import { IonHeader, IonCol, IonRow, IonGrid, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { ActionType } from "../../store/types";
import PagePane from "../../components/PagePane";
import IssuePane from "../../components/IssuePane";
import Analyze from "../../components/Analyze";
import { crawlAsync } from "../../util";
import { ResultType } from "../../store/models/Project";
import { Redirect } from "../../util/router";
import { AppContext, Project } from "../../store";
import './styles.scss';

const ProjectPage: React.FunctionComponent<any> = ({ match: { params }, ...props }) => {
  const { state, dispatch } = useContext<any>(AppContext);
  const project = state.projects.find((project: Project) => project.id === params.project);

  /** Set it once on load */
  useEffect(() => {
    if (project) {
      dispatch({ type: ActionType.SetProject, payload: { project } });
    }

    if (!state.page && project.pages.length) {
      dispatch({ type: ActionType.SetPage, payload: { page: project.pages[0] } });
    }
  }, [dispatch, state.page, project]);

  /** project redirect */
  if (!project) {
    return (
      <Redirect to="/projects" />
    )
  }

  const page: any = project.pages.length ? project.pages[state.page || 0] : false;

  const analyze = async () => {
    dispatch({ type: ActionType.CrawlPage, payload: { page } });
    crawlAsync(page.url, state.project);
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
      {page &&
        <>
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
        </>
      }
    </div>
  );
}

export default ProjectPage;
