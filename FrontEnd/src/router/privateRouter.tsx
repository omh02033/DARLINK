import React from 'react';
import { Redirect, Switch, Route } from 'react-router';
import { Main } from 'pages';

const Redirector: React.VFC = () => (
    <Redirect to="/" />
);

export default () => {
    return (
        <Switch>
            <Route path='/' exact component={Main} />
            <Route component={Redirector} />
        </Switch>
    );
}