import React, { Suspense } from 'react';
import { Router } from 'react-router';
import { ToastContainer } from 'react-toastify';
import useAuth from 'hook/auth';
import Loading from 'components/Loading';
import PublicRouter from './publicRouter';
import PrivateRouter from './privateRouter';
import history from './history';

const App: React.FC = () => {
    const auth = useAuth();

    return (
        <Suspense fallback={<Loading show />}>
            <Loading show={auth.user === undefined}/>
            <ToastContainer/>
            {auth.user !== undefined && (
                <Router history={history}>
                    {auth.user ? <PrivateRouter /> : <PublicRouter />}
                </Router>
            )}
        </Suspense>
    );
}

export default App;