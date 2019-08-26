import React from 'react';
import { IonCol } from '@ionic/react';
import './styles.scss';

const MainPanel: React.FunctionComponent = (props) => {
  const { children } = props;
  return (
    <IonCol size="9" className="MainPanel">
      {children}
    </IonCol>
  );
}

export default MainPanel;
