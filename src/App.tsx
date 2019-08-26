import React from 'react';
import { AppContextProvider } from './store';
import { Switch, Route, Router, Redirect } from './util/router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import 'highlight.js/styles/monokai-sublime.css';
import './theme/variables.scss';
import './App.scss';

/* Pages */
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';
import ProjectFormPage from './pages/ProjectForm';

/* Components */
import OrganizerPanel from './components/OrganizerPanel';
import MainPanel from './components/MainPanel';
import Window from './components/Window';


const Redirect301: React.FC<any> = ({ location }) => {
  return (
    <Redirect to='/projects' />
  );
}

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <Router>
        <Window>
          <OrganizerPanel />
          <MainPanel>
            <Switch>
              <Route exact path="/projects" component={HomePage} />
              <Route exact path="/projects/new" component={ProjectFormPage} />
              <Route exact path="/projects/:project" component={ProjectPage} />
              <Route exact path="/projects/:project/edit" component={ProjectFormPage} />
              <Route component={Redirect301} />
            </Switch>
          </MainPanel>
        </Window>
      </Router>
    </AppContextProvider>
  );
}

export default App;
