import { Navigate, Routes, Route } from "react-router-dom";
import {
  Login,
  Main,
  SetToken,
  SignUp
} from 'pages';

// 로그인 하지 않아도 이용할 수 있는 경로 설정

export default () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/setToken' element={<SetToken />} />
      <Route path='*' element={<Navigate to='/login' />} />  {/* 위의 아무 경로도 아닐 때 로그인페이지로 이동 */}
    </Routes>
  );
}