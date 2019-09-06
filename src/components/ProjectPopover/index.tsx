import React from 'react';
import { IonList, IonItem, IonLabel, IonListHeader, IonIcon } from '@ionic/react';
import { Project } from '../../store';
import { create, trash, swap } from 'ionicons/icons';
import './styles.scss';

interface ProjectPopoverProps {
  projects: Project[],
  active: Project|null,
  switchProject: any,
  editProject: any,
  deleteProject: any,
  newProject: any,
}

const ProjectPopover: React.FunctionComponent<ProjectPopoverProps> = ({ active, projects, switchProject, deleteProject, newProject }) => {
  return (
    <div className="project-popover">
      <IonList>
        <IonListHeader>
          <IonLabel>Current Project</IonLabel>
        </IonListHeader>
        { active &&
          <IonItem lines="none" onClick={() => deleteProject(true)}>
            <IonIcon slot="start" color="danger" icon={trash} />
            <IonLabel>
              <h3>Delete Project</h3>
            </IonLabel>
          </IonItem>
        }
      </IonList>
      <IonList>
        <IonListHeader>
          <IonLabel>All Projects</IonLabel>
        </IonListHeader>
        <IonItem lines="none" onClick={() => newProject()}>
          <IonIcon slot="start" color="secondary" icon={create} />
          <IonLabel>
            <h3>Create New Project</h3>
          </IonLabel>
        </IonItem>
        {projects.map((project: Project, index: number) => (
          <IonItem detail={false} key={index} lines="none" onClick={() => switchProject(project)}>
            <IonIcon slot="start" color="primary" icon={swap} />
            <IonLabel text-wrap={true}>
              <h3>{project.name}</h3>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

ProjectPopover.defaultProps = {
  projects: [],
  active: null,
  switchProject: () => {},
  editProject: () => {},
  deleteProject: () => {},
  newProject: () => {},
}

export default ProjectPopover;
