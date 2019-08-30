import React, { useState, useEffect, useContext } from "react";
import { IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonCheckbox, IonList, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { add, trash, closeCircleOutline } from "ionicons/icons";
import _ from 'lodash';
import * as uuid from 'uuid';
import './styles.scss';
import { useRouter } from "../../util/router";
import { AppContext, Page } from "../../store";
import { ActionType } from "../../store/types";
import { crawl, pageLinks } from "../../util";
import { ResultType, Tag } from "../../store/models/Project";

const ProjectFormPage: React.FunctionComponent<any> = () => {
  /** static */
  const tagValues: Tag[] = [
    { label: 'Best Practice', value: 'best-practice', checked: true },
    { label: 'WCAG A', value: 'wcag2a', checked: true },
    { label: 'WCAG AA', value: 'wcag2aa', checked: false },
    { label: 'Section 508', value: 'section508', checked: false },
  ];

  // ['violations', 'incomplete', 'inapplicable', 'passes']
  const resultTypes: ResultType[] = [
    { label: 'Violations', value: 'violations', checked: true, color: 'primary' },
    { label: 'Incomplete', value: 'incomplete', checked: true, color: 'secondary' },
    { label: 'Inapplicable', value: 'inapplicable', checked: true, color: 'tertiary' },
    { label: 'Passes', value: 'passes', checked: true, color: 'success' },
  ]

  const project: any = {
    name: 'Boplex Audit',
    tags: [],
    useJs: true,
    home: 'http://dev.boplex.com',
    pages: [],
    numPages: 1,
    timestamp: (new Date()).toDateString()
  };

  /** hooks */
  const router = useRouter();
  const { state, dispatch } = useContext<any>(AppContext);
  const [formValue, setFormValues] = useState<any>(state.project && state.project.id ? state.project : project);
  const [tags, setTags] = useState<any>(tagValues);
  const [types, setTypes] = useState<any>(resultTypes);
  const [valid, isValid] = useState<any>(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (formValue.home) {
      isValid(true);
    } else {
      isValid(false);
    }
  }, [formValue.home]);

  //** methods */
  const heading = () => {
    if (state.project && state.project.id) {
      return `Edit Project ${state.project.name}`;
    }
    return 'Create New Project';
  }

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

  const deleteProject = () => {
    // dispatch({ type: ActionType.DeleteProject, payload: { project: formValue } });
    dispatch({ type: ActionType.ShowToast, payload: { toast: { show: true, message: 'Your project has been deleted.' } } });
  }

  const submitForm = async (e: any) => {
    // prevent default
    e.preventDefault();

    // set loader
    dispatch({ type: ActionType.SetLoading, payload: { loading: { show: true } }});

    const project = {
      ...formValue,
      tags: tags.filter((t: Tag) => t.checked),
      resultTypes: types.filter((t: ResultType) => t.checked),
    };

    if (!project.id) {
      project.id = uuid.v4();
    }

    // response from our crawl util -> electron
    const response = await crawl(project.home, project);

    // push page into pages
    const pageIndex = project.pages.findIndex((page: Page) => page.url === response.url);
    if (pageIndex > -1) {
      project.pages[pageIndex] = response;
    } else {
      project.pages.push(response)
    }

    // set up future pages
    const links = pageLinks(response.html, project.home);
    links.forEach((link: string) => {
      if (!project.pages.find((p: Page) => p.url.toLowerCase() === link.toLowerCase())) {
        project.pages.push({
          url: link
        });
      }
    });

    // stop the loader
    dispatch({ type: ActionType.SetLoading, payload: { loading: { show: false } } });

    // save the project
    dispatch({ type: ActionType.SaveProject, payload: { project }});

    // start crawler sub task
    if (project.numPages > 1) {
      // crawler(project.pages, project.numPages, project.useJs, dispatch);
    }

    // go to project
    router.push(`/projects/${project.id}`);
  }

  const cancelForm = () => {
    if (router.history.length) {
      router.history.goBack();
    } else {
      router.replace(`/projects/${state.projects[0].id}`)
    }
  }

  return (
    <div className="ProjectFormPage">
      {state.projects.length > 0 &&
        <IonIcon onClick={() => cancelForm()} className="ProjectFormPage-close" icon={closeCircleOutline} />
      }
      <form className="ProjectFormPage-form" onSubmit={(e: any) => submitForm(e)}>
        <IonGrid>
          <IonRow>
            <IonCol size="8">
              <h1 className="ProjectFormPage-title">{heading()}</h1>
            </IonCol>
          </IonRow>
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
          <IonRow className="project-form-submit">
            <IonCol>
              <IonButton disabled={!valid} type="submit" color="primary">
                Create Project
                <IonIcon slot="end" icon={add} />
              </IonButton>
              {formValue.id &&
                <IonButton color="danger" onClick={() => setShowAlert(true)}>
                  Delete Project
                  <IonIcon slot="end" icon={trash} />
                </IonButton>
              }
            </IonCol>
          </IonRow>
        </IonGrid>
      </form>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Deleting Project'}
        subHeader={formValue.name}
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
    </div>
  );
}

export default ProjectFormPage;
