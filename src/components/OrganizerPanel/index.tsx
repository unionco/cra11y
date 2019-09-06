import React, { useContext, useState } from 'react';
import { IonIcon, IonCol, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonPopover, IonSearchbar, IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonAlert } from '@ionic/react';
import { addCircleOutline, arrowDropdown, more } from 'ionicons/icons';
import ProjectPopover from '../ProjectPopover';
import PageActionPopover from '../PageActionPopover';
import { AppContext, Project, Page } from '../../store';
import { ActionType } from '../../store/types';
import { useRouter } from '../../util/router';
import { crawlAsync } from '../../util/crawl';
import { ResultType } from '../../store/models/Project';
import './styles.scss';

const OrganizerPanel: React.FunctionComponent<any> = () => {

  /** Hooks */
  const router = useRouter();
  const { state, dispatch } = useContext<any>(AppContext);
  const [showPopover, setShowPopover] = useState<any>({ show: false, event: null });
  const [showActions, setShowActions] = useState<any>({ show: false, event: null, page: null });
  const [searchValue, setSearchValue] = useState<any>('');
  const [showAlert, setShowAlert] = useState(false);

  const newProject = () => {
    console.log('start new project');
    setShowPopover({ show: false });

    setTimeout(() => {
      dispatch({ type: ActionType.SetProject, payload: { project: false } });
      router.replace('/projects/new');
    }, 1000);
  }

  const switchProject = (project: Project) => {
    setShowPopover({ show: false });
    dispatch({ type: ActionType.SetLoading, payload: { loading: { show: true } } });

    setTimeout(() => {
      dispatch({ type: ActionType.SetLoading, payload: { loading: { show: false } } });
      router.push(`/projects/${project.id}`);
    }, 1000);
  }

  const editProject = () => {
    router.push(`/projects/${state.project.id}/edit`);
    setShowPopover({ show: false });
  }

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  }

  const setPage = (page: Page) => {
    dispatch({ type: ActionType.SetPage, payload: { page } });
  }

  const deleteProject = () => {
    setShowPopover({ show: false });

    // this does nothing right now...
    dispatch({
      type: ActionType.DeleteProject,
      payload: {
        project: state.project
      }
    });

    dispatch({ type: ActionType.ShowToast, payload: { toast: { show: true, message: 'Your project has been deleted.' } } });
  }

  const deletePage = (page: Page) => {
    setShowActions({ show: false, event: null, page: null });

    const { project } = state;
    const pageIndex = project.pages.findIndex((p: Page) => p.url === page.url);
    project.pages.splice(pageIndex, 1);
    dispatch({ type: ActionType.UpdateProject, payload: { project } });
    dispatch({
      type: ActionType.SetPage,
      payload: {
        page: project.pages[pageIndex > 0 ? pageIndex - 1 : 0]
      }
    });
  }

  const getPages = () => {
    if (!searchValue) {
      return state.project ? state.project.pages : [];
    }

    return (state.project.pages || []).filter((page: Page) => {
      return page.url.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    })
  }

  const analyze = async (page: Page) => {
    // in case it was open
    setShowActions({ show: false, event: null, page: null });
    dispatch({ type: ActionType.CrawlPage, payload: { page } });
    crawlAsync(page.url, state.project);
  }

  const header = () => {
    if (!state.project) {
      return (
        <IonToolbar>
          <IonTitle>Create New Project</IonTitle>
          <IonButtons slot="end">
            {!state.projects.length ?
              <IonButton
                icon-only={true}
                onClick={(e) => newProject()}
              >
                <IonIcon slot="icon-only" icon={addCircleOutline} />
              </IonButton>
            :
              <IonButton
                icon-only={true}
                onClick={(e: any) => {
                  e.persist();
                  setShowPopover({ show: true, event: e })
                }}
              >
                <IonIcon slot="icon-only" icon={arrowDropdown} />
              </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      );
    }

    return (
      <IonToolbar>
        <IonTitle>{state.project.name}</IonTitle>
        <IonButtons slot="end">
          <IonButton
            icon-only={true}
            onClick={(e: any) => {
              e.persist();
              setShowPopover({ show: true, event: e })
            }}
          >
            <IonIcon slot="icon-only" icon={arrowDropdown} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    );
  }

  return (
    <>
      <IonCol size="3" className="OrganizerPanel">
        <div className="OrganizerPanel-spacer u-drag" />
        {header()}
        <IonContent>
          {state.project &&
            <IonToolbar>
              <IonSearchbar mode="ios" color="light" animated={true} value={searchValue} onIonChange={(e: CustomEvent) => updateSearchValue(e.detail.value)} />
            </IonToolbar>
          }
          <IonList>
            {getPages().map((page: Page, index: number) => (
              <IonItem lines="full" key={index}>
                <IonLabel text-wrap={true} onClick={() => setPage(page)}>
                  <h3>{page.url}</h3>
                  <p>{state.project.timestamp}</p>

                  {page.ally &&
                    <div className="badge-list">
                      {state.project.resultTypes.map((type: ResultType, index: number) => (
                        <IonBadge mode="ios" color={type.color} key={index}>
                          {page.ally && (page.ally as any)[type.value].length}
                        </IonBadge>
                      ))}
                    </div>
                  }
                </IonLabel>
                {page.isCrawling ?
                  <IonSpinner color="light" slot="end" />
                  :
                  <IonIcon
                    color="light"
                    slot="end"
                    icon={more}
                    onClick={(e: any) => {
                      e.persist();
                      setShowActions({ show: true, event: e, page });
                    }}
                  />
                }
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonCol>
      <IonPopover
        isOpen={showPopover.show}
        event={showPopover.event}
        onDidDismiss={() => setShowPopover({ show: false, event: null })}
      >
        <ProjectPopover
          active={state.project}
          projects={state.projects}
          switchProject={switchProject}
          editProject={editProject}
          deleteProject={setShowAlert}
          newProject={newProject}
        />
      </IonPopover>
      <IonPopover
        isOpen={showActions.show}
        event={showActions.event}
        onDidDismiss={() => setShowActions({ show: false, event: null, page: null })}
      >
        <PageActionPopover
          page={showActions.page}
          onRefresh={analyze}
          onDelete={deletePage}
        />
      </IonPopover>
      {state.project &&
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Deleting Project'}
          subHeader={state.project.name}
          message={'Are you sure you want to delete this project? This action is not reversible.'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Confirm',
              handler: () => {
                deleteProject();
              }
            }
          ]}
        />
      }
    </>
  );
}

export default OrganizerPanel;
