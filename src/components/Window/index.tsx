import React, { useContext } from 'react';
import { IonGrid, IonRow, IonLoading, IonToast } from '@ionic/react';
import './styles.scss';
import { AppContext } from '../../store';
import { ActionType } from '../../store/types';

const Window: React.FunctionComponent = (props) => {
  const { children } = props;

  /** hooks */
  const { state, dispatch } = useContext<any>(AppContext);

  return (
    <div className="Window">
      <IonGrid>
        <IonRow>
          {children}
        </IonRow>
      </IonGrid>

      <IonToast
        isOpen={state.toast.show}
        position="top"
        onDidDismiss={() => dispatch({ type: ActionType.ShowToast, payload: { toast: { show: false, message: '' } } })}
        message={state.toast.message}
        duration={3000}
      />

      <IonLoading
        isOpen={state.loading.show}
        message={'Loading...'}
      />
    </div>
  );
}

export default Window;
