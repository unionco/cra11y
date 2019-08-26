import React, { useState } from 'react';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { Page } from '../../store';
import { refresh, trash } from 'ionicons/icons';
// import './styles.scss';

interface ProjectPopoverProps {
  page: Page|null,
  onRefresh: any
  onDelete: any
}

const PageActionPopover: React.FunctionComponent<ProjectPopoverProps> = ({ page, onRefresh, onDelete }) => {
  const [confirm, confirmDelete] = useState(false);

  const clickDelete = () => {
    if (confirm) {
      onDelete(page);
      confirmDelete(false);
    } else {
      confirmDelete(true);
    }
  }

  return (
    <div className="project-popover">
      <IonList>
        <IonItem lines="none" onClick={() => onRefresh(page)}>
          <IonLabel>
            {page && page.ally ? 'Refresh' : 'Analyze'}
          </IonLabel>
          <IonIcon slot="end" icon={refresh} />
        </IonItem>
        <IonItem color="danger" lines="none" onClick={() => clickDelete()}>
          <IonLabel>
            {confirm ? 'Confirm Delete' : 'Delete'}
          </IonLabel>
          <IonIcon slot="end" icon={trash} />
        </IonItem>
      </IonList>
    </div>
  );
};

PageActionPopover.defaultProps = {
  page: null,
  onRefresh: () => {},
  onDelete: () => {},
}

export default PageActionPopover;
