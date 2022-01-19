import React, { createContext, useContext, useState, useEffect } from 'react';
import {api} from 'api';

interface User {
    uid: number;
    userId: string;
    password?: string;
    signUpPath: string;
    email: string;
    name: string;
}

const useProvideAuth = () => {
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        api.get('/auth/isLogin')
        .then(req => {
            const { login, data } = req.data;
            if(!login) {
                setUser(null);
                return;
            }
            setUser(data);
        });
    }, []);

    return { user };
}

const authContext = createContext<ReturnType<typeof useProvideAuth> | undefined>(undefined);

export const ProvideAuth: React.FC = ({children}) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useAuth = () => {
    const auth = useContext(authContext);
    if(auth === undefined) throw new Error("ProvideAuth not found");
    return auth;
}

export default useAuth;