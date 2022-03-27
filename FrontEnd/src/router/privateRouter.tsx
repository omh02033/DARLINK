import { Navigate, Routes, Route } from "react-router-dom";
import {
  Main,
  MyPage,
  DeliExperience,
  DirectExperience,
  Manage
} from 'pages';

// 로그인 해야만 하는 경로들 설정

export default () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/myPage' element={<MyPage />} />
      <Route path='/deliExperience' element={<DeliExperience />} />
      <Route path='/directExperience' element={<DirectExperience />} />
      <Route path='/manage' element={<Manage />} />
      <Route path='*' element={<Navigate to='/' />} />  {/* 위의 아무 경로도 아닐 때 메인페이지로 이동 */}
    </Routes>
  );
}