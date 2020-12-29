import React from "react";
import {
  Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Registration from "./features/registration/Registration";
import Chat from "./features/chat/Chat";
import history from "./history";
import { Provider, useSelector } from "react-redux";
import store from "./app/store";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth);
  const func = (props) =>
    !!auth.user && !!auth.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: "/registration",
        }}
      />
    );
  return <Route {...rest} render={func} />;
};

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/registration">
            <Registration />
          </Route>
          <Route exact path="/chat">
            <Chat />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
