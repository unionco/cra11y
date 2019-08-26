import React from 'react';
import { IonButton } from '@ionic/react';

interface AnalyzeProps {
  href: string;
  useButton?: boolean;
  children?: any
}

const BrowserLink: React.FunctionComponent<AnalyzeProps|any> = ({ children, href, useButton, ...props }) => {
  const open = (e: any) => {
    e.preventDefault();
    (window as any).shell.openExternal(href);
  }

  if (useButton) {
    return (
      <IonButton {...props} onClick={(e: any) => open(e)}>
        {children}
      </IonButton>
    );
  }

  return (
    <a href={href} onClick={(e: any) => open(e)}>
      {children}
    </a>
  );
}

BrowserLink.defaultProps = {
  href: '',
  useButton: false,
}

export default BrowserLink;
