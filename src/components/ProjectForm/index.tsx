import React, { useState, useEffect, useContext } from "react";
import { IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonCheckbox, IonList, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonFooter } from "@ionic/react";
import { add, closeCircleOutline } from "ionicons/icons";
import _ from 'lodash';
import * as uuid from 'uuid';
import { AppContext, Page } from "../../store";
import { ActionType } from "../../store/types";
import { crawlAsync } from "../../util";
import { ResultType, Tag, Project, defaultTags, defaultResultTypes } from "../../store/models/Project";
import './styles.scss';

const ProjectForm: React.FunctionComponent<any> = () => {
  const project: any = {
    name: 'Boplex Audit',
    tags: [],
    useJs: true,
    home: 'https://www.boplex.com',
    pages: [],
    numPages: 1,
    timestamp: (new Date()).toDateString()
  };

  /** hooks */
  const { dispatch } = useContext<any>(AppContext);
  const [formValue, setFormValues] = useState<any>(project);
  const [tags, setTags] = useState<any>(defaultTags);
  const [types, setTypes] = useState<any>(defaultResultTypes);
  const [valid, isValid] = useState<any>(false);

  // TODO::add validation for url
  useEffect(() => {
    if (formValue.home) {
      isValid(true);
    } else {
      isValid(false);
    }
  }, [formValue.home]);

  const updateFormField = (key: string, value: any) => {
    const newValues = _.merge(formValue, { [key]: value });
    setFormValues({
      ...newValues
    });
  }

  const updateTags = (tag: any, checked: boolean) => {
    const index = tags.findIndex((t: any) => t.value === tag.value);
    tags[index].checked = checked;
    setTags(tags);
  }

  const updateTypes = (type: any, checked: boolean) => {
    const index = types.findIndex((t: any) => t.value === type.value);
    types[index].checked = checked;
    setTypes(types);
  }

  const submitForm = async (e: any) => {
    // prevent default
    e.preventDefault();

    // set loader
    dispatch({ type: ActionType.SetLoading, payload: { loading: { show: true } } });

    // setup project data
    const project: Project = {
      ...formValue,
      tags: tags.filter((t: Tag) => t.checked),
      resultTypes: types.filter((t: ResultType) => t.checked),
    };

    // on new project - give it an ID
    if (!project.id) {
      project.id = uuid.v4();
    }

    // push page into pages
    const pageIndex = project.pages.findIndex((page: Page) => page.url === project.home);
    if (pageIndex === -1) {
      project.pages.push({
        url: project.home,
        isCrawling: true
      });
    }

    // crawl it
    crawlAsync(project.home, project);

    // save the project
    dispatch({ type: ActionType.SaveProject, payload: { project } });

    // start crawler sub task
    if (project.numPages > 1) {
      // crawler(project.pages, project.numPages, project.useJs, dispatch);
    }

    setTimeout(() => {
      // kill the modal
      dispatch({ type: ActionType.ShowModal, payload: { modal: { show: false, component: undefined } } });

      // stop the loader
      dispatch({ type: ActionType.SetLoading, payload: { loading: { show: false } } });

      // go to project
      dispatch({ type: ActionType.SetProject, payload: { project } });
    }, 500);
  }

  const cancelForm = () => {
    dispatch({ type: ActionType.ShowModal, payload: { modal: { show: false, component: undefined } } });
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create New Project</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => cancelForm()}>
              <IonIcon slot="icon-only" icon={closeCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ProjectForm">
        <form className="ProjectForm-form" onSubmit={(e: any) => submitForm(e)}>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonItem lines="none">
                  <IonLabel position="floating">
                    <h3>Project Name</h3>
                  </IonLabel>
                  <IonInput
                    type="text"
                    name="name"
                    value={formValue.name}
                    onIonChange={(e) => updateFormField('name', e.detail.value)}
                  />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem lines="none">
                  <IonLabel position="floating">
                    <h3>Number of Pages</h3>
                  </IonLabel>
                  <IonInput
                    type="number"
                    name="numPages"
                    value={formValue.numPages}
                    onIonChange={(e) => updateFormField('numPages', e.detail.value)}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonLabel position="floating">
                    <h3>Home Url</h3>
                  </IonLabel>
                  <IonInput
                    type="text"
                    name="name"
                    value={formValue.home}
                    disabled={formValue.id}
                    onIonChange={(e) => updateFormField('home', e.detail.value)}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonLabel text-wrap>
                    <h3>Enable Javascript</h3>
                    <p>Warning: This may cause crawling to take longer.</p>
                  </IonLabel>
                  <IonCheckbox
                    slot="end"
                    color="primary"
                    name="useJs"
                    checked={formValue.useJs}
                    onIonChange={() => updateFormField('useJs', !formValue.useJs)}
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <h2>A11y Rules</h2>
                <p>Limit which rules are executed, based on names or tags.</p>
                <IonList className="project-form-group">
                  {tags.map((tag: any, i: number) => (
                    <IonItem key={i} lines="none">
                      <IonLabel>
                        {tag.label}
                      </IonLabel>
                      <IonCheckbox slot="end" value={tag.value} checked={tag.checked} color="primary" onIonChange={(e) => updateTags(tag, e.detail.checked)} />
                    </IonItem>
                  ))}
                </IonList>
              </IonCol>
              <IonCol>
                <h2>Result Types</h2>
                <p>Limit which result types are processed and aggregated.</p>
                <IonList className="project-form-group">
                  {types.map((type: any, i: number) => (
                    <IonItem key={i} lines="none">
                      <IonLabel>
                        {type.label}
                      </IonLabel>
                      <IonCheckbox slot="end" value={type.value} checked={type.checked} color={type.color} onIonChange={(e) => updateTypes(type, e.detail.checked)} />
                    </IonItem>
                  ))}
                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton disabled={!valid} type="submit" color="primary" onClick={(e: any) => submitForm(e)}>
              Save Project
              <IonIcon slot="end" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </>
  );
}

export default ProjectForm;
