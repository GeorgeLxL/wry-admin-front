import React, { Component } from 'react';
import {BrowserRouter as Router } from 'react-router-dom';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBFormInline,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBContainer,
  MDBIcon
} from 'mdbreact';

import "../../assets/styles/admin.css";
import Dashboard from '../admin/Dashboard';
import dashboardArtistDetail from '../admin/DashboardArtistDetail';
import dashboardUserDetail from '../admin/DashboardUserDetail';
import userTransaction from '../admin/UserTransaction';
import userTransactionDetail from '../admin/UserTransactionDetail';
import artistPayment from '../admin/ArtistPayment';
import Liveapplication from '../admin/LiveApplication';
import liveapplicationDetail from '../admin/LiveApplicationDetail'
import artistpaymentDetail from '../admin/ArtistPaymentDetail'
import createSinglePayment from '../admin/CreateSinglePayment'
import createBulkPayment from '../admin/CreateBulkPayment'
import { Route, Switch } from 'react-router-dom';
import { logout } from '../../assets/js/login';


class Admin extends Component {
    state = {
        collapseID: ''
      };
    
    toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ''
    }));
  
    closeCollapse = collID => () => {
      const { collapseID } = this.state;
      window.scrollTo(0, 0);
      collapseID === collID && this.setState({ collapseID: '' });
    };
    async handleLogout() {
      await logout();
      window.location.assign('/');
    }
      render() {
        const overlay = (
          <div
            id='sidenav-overlay'
            style={{ backgroundColor: 'transparent' }}
            onClick={this.toggleCollapse('mainNavbarCollapse')}
          />
        );
    
        const {collapseID } = this.state;
        return(
            
            <>
          <Router>
                <MDBNavbar
                color='white'
                dark
                expand='md'
                style={{ marginTop: '0px' }} 
                fixed='top' scrolling
                >
                    <MDBNavbarBrand className="logotext">
                    <strong className='black-text' onClick={e=>{window.location.assign('/admin')}}>WeRaveYou</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler style={{background:"black"}} 
                    onClick={this.toggleCollapse('mainnavbarCollapse')}
                    />
                    <MDBCollapse id='mainnavbarCollapse' isOpen={collapseID} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem>
                            <MDBNavLink className='black-text'  onClick={this.closeCollapse('mainnavbarCollapse')} to='/admin/dashboard'>Dashboard</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                            <MDBNavLink  className='black-text'  onClick={this.closeCollapse('mainnavbarCollapse')} to='/admin/userTransaction'>User Transaction</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                            <MDBNavLink  className='black-text' onClick={this.closeCollapse('mainnavbarCollapse')} to='/admin/artistPayment'>Artist Payment</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                            <MDBNavLink  className='black-text'  onClick={this.closeCollapse('mainnavbarCollapse')} to='/admin/liveApplication'>Live Application</MDBNavLink>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                            <MDBNavLink className='black-text'to='/profiel'>Account</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                            <MDBNavLink className="logoutbtn" onClick={this.handleLogout} to="/">LOGOUT</MDBNavLink>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                {collapseID && overlay}
                <main>
                  
                    <Switch>
                      <Route exact path='/admin/dashboard' component={Dashboard} />
                      <Route exact path='/admin/dashboard/artistDetail/:id' component={dashboardArtistDetail} />
                      <Route exact path='/admin/dashboard/userDetail/:id' component={dashboardUserDetail} />
                      <Route exact path='/admin/userTransaction' component={userTransaction} />
                      <Route exact path='/admin/userTransaction/detail/:id :userid :contentType :subscriptionId :tabid' component={userTransactionDetail} />
                      <Route exact path='/admin/artistPayment' component={artistPayment} />
                      <Route exact path='/admin/artistPayment/detail/:requestid :artistid' component={artistpaymentDetail} /> 
                      <Route exact path='/admin/liveApplication' component={Liveapplication} /> 
                      <Route exact path='/admin/liveApplication/detail/:id' component={liveapplicationDetail} />      
                      <Route exact path='/admin/artistPayment/singlePayment' component={createSinglePayment} /> 
                      <Route exact path='/admin/artistPayment/blukPayment' component={createBulkPayment} />   
                   
                    </Switch>             

                </main>
            </Router>
                
            </>
        );
      }
}
export default Admin;