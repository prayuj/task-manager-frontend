import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import PrivateRoute from './components/privateRoute'
import Login from './components/login'
import Register from './components/register'
import Dashboard from './components/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Dashboard />
          </PrivateRoute>
          <Route path="/register">
            <Register />
          </Route>
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
