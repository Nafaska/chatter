import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import Registration from "./features/registration/Registration";
import Login from "./features/login/Login";
import Chat from "./features/chat/Chat";
import history from "./history";
import { Provider, useSelector } from "react-redux";
import store from "./app/store";

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const registration = useSelector((s) => s.registration);
  const login = useSelector((s) => s.login);

  const func = (props) =>
    (!!registration.user && !!registration.token) ||
    (!!login.user && !!login.token) ? (
      <Redirect to={{ pathname: "/registration" }} />
    ) : (
      <Component {...props} />
    );
  return <Route {...rest} render={func} />;
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const registration = useSelector((s) => s.registration);
  const login = useSelector((s) => s.login);

  const func = (props) =>
    (!!registration.user && !!registration.token) ||
    (!!login.user && !!login.token) ? (
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
          <OnlyAnonymousRoute
            exact
            path="/registration"
            component={Registration}
          ></OnlyAnonymousRoute>
          <OnlyAnonymousRoute
            exact
            path="/login"
            component={Login}
          ></OnlyAnonymousRoute>
          <PrivateRoute exact path="/chat" component={Chat}></PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
