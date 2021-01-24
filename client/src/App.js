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
import Toast from "./features/helpers/toast";
import Admin from "./features/admin/Admin";
import Spinner from "./features/helpers/Spinner";

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth);
  const func = (props) => {
      if (auth.role.includes("user")) {
        return <Redirect to={{ pathname: "/channels" }} />;
      } else {
        return <Component {...props} />;
      }
  };

  return <Route {...rest} render={func} />;
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth);

  const func = (props) => {
    if (!auth.isAuthenticated) {
      return <Spinner height="h-screen" />;
    } else {
      if (auth.role.includes("user")) {
        return <Component {...props} />;
      } else {
        return <Redirect to={{ pathname: "/login" }} />;
      }
    }
  };
  return <Route {...rest} render={func} />;
};

const AdminRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth);

  const func = (props) => {
    if (!auth.isAuthenticated) {
      return <Spinner height="h-screen" />;
    } else {
      if (auth.role.includes("admin")) {
        return <Component {...props} />;
      } else {
        return <Redirect to={{ pathname: "/channels" }} />;
      }
    }
  };
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
              <PrivateRoute
                exact
                path="/channels"
                component={Channel}
              ></PrivateRoute>
              <PrivateRoute
                path="/channels/:channel"
                component={Chat}
              ></PrivateRoute>
              <AdminRoute path="/admin" component={Admin}></AdminRoute>
            </Switch>
          </Startup>
        </Router>
      </WebSocketProvider>
      <Toast />
    </Provider>
  );
}

export default App;
