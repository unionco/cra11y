import React from "react";
// import { IonButton } from '@ionic/react';
// import { useRouter } from "../../util/router";
import BrowserLink from "../../components/BrowserLink";
import './styles.scss';

const HomePage: React.FunctionComponent = () => {
  // const router = useRouter();

  return (
    <div className="HomePage">
      <h1>Cra11y</h1>
      <p>An open source web a11y crawling tool using <BrowserLink href="https://electronjs.org">Electron</BrowserLink>, <BrowserLink href="https://reactjs.org/">React</BrowserLink>, and <BrowserLink href="https://www.deque.com/axe/">Axe</BrowserLink>.</p>
      <p>To learn more about a11y visit <BrowserLink href="https://www.w3.org/TR/WCAG21/">WCAG</BrowserLink>.</p>
    </div>
  );
}

export default HomePage;
