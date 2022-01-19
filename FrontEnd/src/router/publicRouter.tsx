import React from 'react';
import { Redirect, Switch, Route } from 'react-router';
import { Main, Login, SignUp } from 'pages';

const Redirector: React.VFC = () => (
    <Redirect to={`/?url=${window.location.pathname}`} />
);

export default () => {
    return (
        <Switch>
            <Route path='/' exact component={Main} />
            <Route path='/login' exact component={Login} />
            <Route path='/signup' exact component={SignUp} />
            <Route component={Redirector} />
        </Switch>
    );
}