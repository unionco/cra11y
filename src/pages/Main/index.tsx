import React, { useContext, useEffect } from 'react';
import { IonGrid, IonRow, IonLoading, IonToast, IonModal } from '@ionic/react';
import { AppContext } from '../../store';
import { ActionType } from '../../store/types';
import './styles.scss';


// Components
import ProjectListing from '../../components/ProjectListing';
import ProjectDetail from '../../components/ProjectDetail';

const Main: React.FunctionComponent = () => {

  /** hooks */
  const { state, dispatch } = useContext<any>(AppContext);

  useEffect(() => {
    // idk
  }, [state.project]);

  const layout = () => {
    if (state.project) {
      return (
        <ProjectDetail project={state.project}/>
      )
    }
    return (
      <ProjectListing />
    )
  }

  return (
    <div className="Main">
      <IonGrid>
        <IonRow>
          {layout()}
        </IonRow>
      </IonGrid>

      <IonToast
        mode="ios"
        isOpen={state.toast.show}
        position="top"
        onDidDismiss={() => dispatch({ type: ActionType.ShowToast, payload: { toast: { show: false, message: '' } } })}
        message={state.toast.message}
        duration={3000}
      />

      <IonLoading
        mode="ios"
        isOpen={state.loading.show}
        message={'Loading...'}
      />

      <IonModal
        isOpen={state.modal.component !== undefined && state.modal.show}
        onDidDismiss={() => dispatch({ type: ActionType.ShowModal, payload: { modal: { show: false, component: undefined } } })}
      >
        {state.modal.component &&
          <state.modal.component />
        }
      </IonModal>
    </div>
  );
}

export default Main;
