import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './views/auth/Login';
import Admin from './views/layouts/Admin';
import Detail from './views/layouts/Detail'

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/admin' component={Admin} />
        <Route exact path='/detail' component={Detail} />
      
        <Route
          render={function() {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;
