import React from 'react';
import { IonList, IonItem, IonLabel, IonListHeader, IonIcon } from '@ionic/react';
import { Project } from '../../store';
import { create, settings, swap } from 'ionicons/icons';
import './styles.scss';

interface ProjectPopoverProps {
  projects: Project[],
  active: Project|null,
  switchProject: any,
  editProject: any,
  newProject: any,
}

const ProjectPopover: React.FunctionComponent<ProjectPopoverProps> = ({ active, projects, switchProject, editProject, newProject }) => {
  return (
    <div className="project-popover">
      <IonList>
        <IonListHeader>
          <IonLabel>Current Project</IonLabel>
        </IonListHeader>
        { active &&
          <IonItem lines="none" onClick={() => editProject()}>
            <IonIcon slot="start" icon={settings} />
            <IonLabel>
              <h3>Edit Project</h3>
            </IonLabel>
          </IonItem>
        }
      </IonList>
      <IonList>
        <IonListHeader>
          <IonLabel>All Projects</IonLabel>
        </IonListHeader>
        <IonItem lines="none" onClick={() => newProject()}>
          <IonIcon slot="start" icon={create} />
          <IonLabel>
            <h3>Create New Project</h3>
          </IonLabel>
        </IonItem>
        {projects.map((project: Project, index: number) => (
          <IonItem detail={false} key={index} lines="none" onClick={() => switchProject(project)}>
            <IonIcon slot="start" icon={swap} />
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
  newProject: () => {},
}

export default ProjectPopover;
