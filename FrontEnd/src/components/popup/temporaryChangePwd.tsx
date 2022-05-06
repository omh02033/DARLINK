import { useState } from 'react';
import styled from '@emotion/styled';
import { api } from 'api';
import { toast } from 'react-toastify';
import { Blinder, Container, Title } from './partial';

const PasswordForm = styled.form`
  width: 40%;
  height: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;
const PasswordField = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  background: #00000030;
`;
const PasswordSubmitBtn = styled.input`
  padding: 13px 40px;
  border-radius: 15px;
  background: #e9b897;
  font: 1.2em Sandoll Gothic L;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
`;

interface PropsIF {
  popupOn: boolean;
  onClose: Function;
}

const TemporaryChangePwd = ({popupOn, onClose}: PropsIF) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const sendPwd = (e: any) => {
    e.preventDefault();
    if(!password || !confirmPassword) return;

    if(password === confirmPassword) {
      api.post('/user/changePwd/tem', { password })
      .then(({data}) => {
        if(data.success) toast.success("비밀번호 변경에 성공했어요.");
        onClose(false);
        window.location.replace('/');
      });
    } else return toast.warning("비밀번호를 확인해주세요.");
  }

  return (
    <Blinder isOn={popupOn} pst='absolute'>
      <Container isOn={popupOn}>
        <Title>비밀번호를 변경하세요!!</Title>
        <PasswordForm onSubmit={sendPwd}>
            <PasswordField
            type="password"
            onChange={(e) => {setPassword(e.target.value);}}
            value={password}
            placeholder="비밀번호" />
            <PasswordField
            type="password"
            onChange={(e) => {setConfirmPassword(e.target.value);}}
            value={confirmPassword}
            placeholder="비밀번호 확인" />

            <PasswordSubmitBtn type="submit" value="비밀번호 변경" />
        </PasswordForm>
      </Container>
    </Blinder>
  );
}

export default TemporaryChangePwd;