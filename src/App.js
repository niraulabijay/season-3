import './App.css';
import Navbar from "./components/Navbar";
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { routes } from './routes';
import Main from './components/Main';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<Main><route.body/></Main>}
            />
          ))}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
