import React, { useContext, useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonGrid, IonRow } from '@ionic/react';
import _get from 'lodash/get';
import { ResultType, Project } from '../../store/models/Project';
import { AppContext, Page } from '../../store';
import { ActionType } from '../../store/types';
import OrganizerPanel from '../OrganizerPanel';
import MainPanel from '../MainPanel';
import PagePane from '../PagePane';
import Analyze from '../Analyze';
import { crawlAsync, store, get } from '../../util';
import './styles.scss';

interface ProjectDetailProps {
  project: Project
}

const ProjectDetail: React.FunctionComponent<ProjectDetailProps> = ({ project }) => {

  /** hooks */
  const { state, dispatch } = useContext<any>(AppContext);

  const storedIndex: any = get(`${project.id}.activePage`);
  const [activePage, setActivePage] = useState(storedIndex || 0);

  let page: Page = project.pages[activePage] ? project.pages[activePage] : project.pages[0];
  useEffect(() => {
    page = project.pages[activePage] ? project.pages[activePage] : project.pages[0];
  }, [project, activePage])

  const scrollTo = (section: string) => {
    const el: HTMLElement | null = document.querySelector(`#section-${section}`);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  const getValue = (type: any, index: number) => {
    const result = _get(page, `ally.${type.value}`);

    if (result) {
      return (
        <IonButton shape="round" key={index} color={type.color} className="ProjectPage-score" onClick={() => scrollTo(type.value)}>
          {result.length}
        </IonButton>
      )
    }
  }

  const analyze = async () => {
    dispatch({ type: ActionType.CrawlPage, payload: { page } });
    crawlAsync(page.url, state.project);
  }

  const getContent = () => {
    if (project && page && page.ally) {
      return (
        <PagePane project={state.project} page={page} />
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

  const changePage = (page: Page) => {
    const index = project.pages.findIndex((p: Page) => p.url === page.url);
    store(`${project.id}.activePage`, index);
    setActivePage(index);
  }

  return (
    <>
      <OrganizerPanel
        activePage={page}
        changePage={changePage}
      />
      <MainPanel>
        {page &&
          <div className="ProjectDetail">
            <IonHeader>
              <IonToolbar>
                <IonTitle>
                  <h2>{page.url}</h2>
                  <p>{project.timestamp}</p>
                </IonTitle>
                {project && page.ally &&
                  <div className="ProjectPage-scores" slot="end">
                    {project.resultTypes.map((type: ResultType, index: number) => getValue(type, index))}
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
        }
      </MainPanel>
    </>
  );
}

export default ProjectDetail;
