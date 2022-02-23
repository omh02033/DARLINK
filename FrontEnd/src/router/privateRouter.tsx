import { Navigate, Routes, Route } from "react-router-dom";
import {
  Main,
  MyPage,
  DeliExperience,
  DirectExperience,
  Manage
} from 'pages';

export default () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/myPage' element={<MyPage />} />
      <Route path='/deliExperience' element={<DeliExperience />} />
      <Route path='/directExperience' element={<DirectExperience />} />
      <Route path='/manage' element={<Manage />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}