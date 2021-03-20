import React, { Component } from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBFooter,
  MDBNavLink,
  MDBTooltip,
  MDBIcon
} from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';

import { Route, Switch,Redirect } from 'react-router-dom';
import Login from './views/auth/Login';
import Admin from './views/layouts/Admin';
import {getCurrentUser} from './assets/js/login';


class App extends Component {
  state = {
    userData: getCurrentUser() || null
  };
  

  render() {
    const {userData} = this.state;
    return (
      <Router>
         <Switch>
          <Route exact path='/' component={Login} />
          
          <Route exact path='/admin/'>
           {userData?<Redirect to="admin/dashboard" />:<Redirect to="/"/>}
          </Route> 
          <Route exact path='/admin/*'>
           {userData?<Admin/>:<Redirect to="/"/>}
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
