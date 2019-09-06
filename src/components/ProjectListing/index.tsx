import React, { useContext } from "react";
import { IonCard, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonIcon, IonThumbnail, IonButton } from "@ionic/react";
import { swap } from "ionicons/icons";
import BrowserLink from "../../components/BrowserLink";
import logo from '../../logo.png';
import { AppContext, Project } from "../../store";
import { ActionType } from "../../store/types";
import './styles.scss';
import ProjectForm from "../ProjectForm";

const ProjectListing: React.FunctionComponent = () => {
  const { state, dispatch } = useContext<any>(AppContext);

  const openProject = (project: Project) => {
    dispatch({ type: ActionType.SetLoading, payload: { loading: { show: true } } });

    setTimeout(() => {
      dispatch({ type: ActionType.SetLoading, payload: { loading: { show: false } } });
      dispatch({ type: ActionType.SetProject, payload: { project } });
    }, 1000);
  }

  const createProject = () => {
    dispatch({
      type: ActionType.ShowModal,
      payload: {
        modal: {
          show: true,
          component: ProjectForm
        }
      }
    });
  }

  const layout = () => {
    if (state.projects && state.projects.length) {
      return (
        <>
          <IonListHeader mode="ios">
            All Projects
                </IonListHeader>
          {state.projects.map((project: Project, index: number) => (
            <IonItem lines={index === state.projects.length - 1 ? 'none' : 'inset'} key={index} onClick={() => openProject(project)}>
              <IonLabel>{project.name}</IonLabel>
              <IonIcon color="primary" slot="end" icon={swap} />
            </IonItem>
          ))}
        </>
      );
    }

    return (
      <>
        <IonItem lines="none">
          <IonLabel>
            <h3>You have no projects</h3>
          </IonLabel>
          <IonButton color="primary" slot="end" onClick={() => createProject()}>
            Create Project
          </IonButton>
        </IonItem>
      </>
    )
  }

  return (
    <div className="ProjectListing">
      <IonItem className="ProjectListing-intro" lines="none">
        <IonThumbnail slot="start">
          <img className="Logo-inner" src={logo} alt="logo" />
        </IonThumbnail>
        <IonLabel text-wrap={true}>
          <h1>Cra11y App</h1>
          <p>An open source web a11y crawling tool using <BrowserLink href="https://electronjs.org">Electron</BrowserLink>, <BrowserLink href="https://reactjs.org/">React</BrowserLink>, and <BrowserLink href="https://www.deque.com/axe/">Axe</BrowserLink>.</p>
          <p>To learn more about a11y visit <BrowserLink href="https://www.w3.org/TR/WCAG21/">WCAG</BrowserLink>.</p>
        </IonLabel>
      </IonItem>

      <IonCard className="ProjectListing-card">
        <IonCardContent>
          <IonList>
            {layout()}
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default ProjectListing;
