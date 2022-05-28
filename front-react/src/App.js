import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Feed from "./Components/Feed";
import Response from "./Components/Response";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivateRoute from "./Components/privateroute";
import Home from "./Components/Home";
import ItemPage from "./Components/ItemPage";
import MyListings from "./Components/MyListings";
import { ToastProvider } from "react-toast-notifications";
window.OneSignal = window.OneSignal || [];
const OneSignal = window.OneSignal;
function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/sign-up" component={Signup} exact />
          <Route path="/log-in" component={Login} />
          <PrivateRoute path="/annonces" component={Feed} />
          <Route path="/mesannonces" component={MyListings} exact />
          <Route path="/reponses" component={Response} exact />
          <ToastProvider autoDismiss={true} placement={"bottom-right"}>
            <Route path="/:item" component={ItemPage} exact />
          </ToastProvider>
        </Switch>
      </Router>
    </>
  );
}

export default App;
