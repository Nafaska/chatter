import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import Registration from "./features/auth/Registration";
import Startup from "./startup";
import Login from "./features/auth/Login";
import Chat from "./features/chat/Chat";
import Channel from "./features/channel/Channel";
import history from "./history";
import { Provider, useSelector } from "react-redux";
import { store } from "./app/store";
import WebSocketProvider from "./WebSocket";

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth);

  const func = (props) =>
    !!auth.role && !!auth.token ? (
      <Redirect to={{ pathname: "/channel" }} />
    ) : (
      <Component {...props} />
    );
  return <Route {...rest} render={func} />;
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth);

  const func = (props) =>
    !!auth.role && !!auth.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  return <Route {...rest} render={func} />;
};

function App() {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Router history={history}>
          <Startup>
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
              <PrivateRoute exact path="/channel" component={Channel}></PrivateRoute>
              {/* <PrivateRoute exact path="/chat" component={Chat}></PrivateRoute> */}
              <PrivateRoute exact path="/chat/:channel" component={Chat}></PrivateRoute>
            </Switch>
          </Startup>
        </Router>
      </WebSocketProvider>
    </Provider>
  );
}

export default App;
