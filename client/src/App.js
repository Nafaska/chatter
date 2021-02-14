import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import RegistrationPage from "./features/auth/Registration";
import Startup from "./startup";
import LoginPage from "./features/auth/LoginPage";
import ChatPage from "./features/chat/ChatPage";
import ChannelsPage from "./features/channel/ChannelsPage";
import history from "./history";
import { Provider, useSelector } from "react-redux";
import { store } from "./app/store";
import WebSocketProvider from "./WebSocket";
import ToastNotification from "./features/helpers/ToastNotification";
import AdminPage from "./features/admin/AdminPage";
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
                component={RegistrationPage}
              ></OnlyAnonymousRoute>
              <OnlyAnonymousRoute
                exact
                path="/login"
                component={LoginPage}
              ></OnlyAnonymousRoute>
              <PrivateRoute
                exact
                path="/channels"
                component={ChannelsPage}
              ></PrivateRoute>
              <PrivateRoute
                path="/channels/:channel"
                component={ChatPage}
              ></PrivateRoute>
              <AdminRoute path="/admin" component={AdminPage}></AdminRoute>
              <Redirect from="/" to="/channels" />
            </Switch>
          </Startup>
        </Router>
      </WebSocketProvider>
      <ToastNotification />
    </Provider>
  );
}

export default App;