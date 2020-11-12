import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import EventsPage from './pages/EventsPage';
import TopNav from './components/TopNav';
import MyRegistration from './pages/MyRegistration';


export default function Routes() {
  return (
    <BrowserRouter>
      <TopNav/>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/events" component={EventsPage} />
        <Route path="/myregistration" component={MyRegistration} />
      </Switch>
    </BrowserRouter>
  );
}