import React from 'react';
import './styles.scss';
import { IonButton, IonSpinner } from '@ionic/react';
import { Page } from '../../store';

interface AnalyzeProps {
  page?: Page,
  analyze: any
}

const Analyze: React.FunctionComponent<AnalyzeProps> = ({ page, analyze }) => {
  return (
    <div className="Analyze">
      <h1>Analyze</h1>
      <p>{page && page.url}</p>

      {page && page.isCrawling ?
        <IonSpinner />
        :
        <IonButton color="primary" onClick={() => analyze()}>
          Analyze
        </IonButton>
      }
    </div>
  );
}

Analyze.defaultProps = {
  page: undefined,
  analyze: () => {}
}

export default Analyze;
