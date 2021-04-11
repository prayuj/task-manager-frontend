import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import PrivateRoute from './components/privateRoute'
import Login from './components/login'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <div>Dashboard</div>
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute>
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
