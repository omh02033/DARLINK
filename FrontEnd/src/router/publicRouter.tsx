import { Navigate, Routes, Route } from "react-router-dom";
import {
    Login,
    Main,
    SetToken,
    SignUp
} from 'pages';

export default () => {
    return (
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/setToken' element={<SetToken />} />
            <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
    );
}