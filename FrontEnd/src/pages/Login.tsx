import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { api, setCookie } from 'api';
import { toast } from 'react-toastify';

import kakaoLoginImg from 'stylesheets/images/kakao_login.png';
import FPPopup from 'components/popup/forgetPasswd';
import CPPopup from 'components/popup/temporaryChangePwd';

const Container = styled.div`
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 85%;
`;
const PageTitle = styled.div`
  font: 30px Sandoll Gothic M;
`;
const LoginForm = styled.form`
  width: 100%;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const LoginField = styled.input`
  width: 50%;
  border: 1px solid #00000033;
  border-radius: 10px;
  padding: 10px;
`;
const PasswordField = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 50%;
  align-items: flex-end;
  & > input {
    width: 100%;
    margin-bottom: 6px;
  }
`;
const ForgetPassLink = styled.span`
  color: #000;
  cursor: pointer;
`;
const LoginSubmitBtn = styled.input`
  width: 30%;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: #e9b897;
  font: 15px Sandoll Gothic M;
  padding: 10px;
  cursor: pointer;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
`;

const SignUpBtn = styled(Link)`
  display: block;
  text-align: center;
  width: 30%;
  padding: 10px;
  font: 15px Sandoll Gothic M;
  border-radius: 10px;
  background: #00000033;
  color: #000;
  text-decoration: none;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
`;

const KakaoLogin = styled.img`
  width: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const Login: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [userPwd, setUserPwd] = useState<string>("");

  const [FPpopupOn, setFPPopupOn] = useState<boolean>(false);
  const [CPpopupOn, setCPPopupOn] = useState<boolean>(false);

  const loginSubmit = (e: any) => {
    e.preventDefault();
    if(!userId || !userPwd) return;

    api.post('/auth/login', {
      uid: userId,
      upw: userPwd
    })
    .then(({data}) => {
      if(data.success) {
        setCookie('token', data.token);
        if(data.temporary) {
          setCPPopupOn(true);
        } else window.location.replace('/');
      }
    });
  }

  const kakaoLoginPage = () => {
    const popup = window.open(`${process.env.REACT_APP_BACK_URL}/auth/login/kakao`, 'kakaoLogin', 'width=500,height=800,top=100,left=200,location=no');
    const interval = setInterval(() => {
      try {
        if(popup == null || popup.closed) {
          clearInterval(interval);
          window.location.replace('/');
        }
      } catch(e) {
        console.log(e);
        toast.error("에러가 발생했어요.");
      }
    }, 1000);
  }

  const openFPModal = () => {
    setFPPopupOn(true);
  }


  return (
    <Container>
      <PageTitle>로그인</PageTitle>
      <LoginForm onSubmit={loginSubmit}>
        <LoginField
        type="email"
        onChange={({ target: { value } }) => {setUserId(value);}}
        value={userId}
        placeholder="이메일" />
        <PasswordField>
          <LoginField
          type="password"
          onChange={({ target: { value } }) => {setUserPwd(value);}}
          value={userPwd}
          placeholder="비밀번호" />
          <ForgetPassLink onClick={openFPModal}>비밀번호 찾기</ForgetPassLink>
        </PasswordField>
        <LoginSubmitBtn type="submit" value="로그인" />
        <SignUpBtn to="/signup">회원가입</SignUpBtn>
      </LoginForm>
      <KakaoLogin src={kakaoLoginImg} onClick={kakaoLoginPage} />
      <FPPopup
          popupOn={FPpopupOn}
          onClose={setFPPopupOn}
      />
      <CPPopup
          popupOn={CPpopupOn}
          onClose={setCPPopupOn}
      />
    </Container>
  );
}
export default Login;