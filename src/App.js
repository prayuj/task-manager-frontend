import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import PrivateRoute from './components/privateRoute'
import Login from './components/login'
import Register from './components/register'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <div>Dashboard</div>
          </PrivateRoute>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
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
