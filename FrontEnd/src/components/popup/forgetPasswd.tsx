import { useState } from 'react';
import styled from '@emotion/styled';
import { api } from 'api';
import { toast } from 'react-toastify';
import { keyframes } from '@emotion/react';
import { Blinder, Container, Title, PropsIF } from './partial';

const EmailForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 40%;
  height: 30%;
`;
const EmailFieldBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50%;
  & > input {
    width: 100%;
  }
  & > span {
    font: 1em Sandoll Gothic L;
  }
`;
const EmailField = styled.input`
  width: 15px;
  padding: 15px;
  background: #00000033;
  border-radius: 15px;
`;

const FPSubmit = styled.input`
  padding: 10px 30px;
  border-radius: 15px;
  background: #e9b897;
  font: 1.2em Sandoll Gothic L;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
`;

const OutGo = styled.input`
  padding: 15px 40px;
  border-radius: 15px;
  background: #e9e7e5;
  font: 1.2em Sandoll Gothic L;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
`;

const LoadKeyframe = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;
const LoaderContainer = styled.div<{isLoading: boolean}>`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({isLoading}) => isLoading ? 1000 : -1};
  opacity: ${({isLoading}) => isLoading ? 1 : 0};
  background: #000000cc;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
`;
const LoaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 150px;
  text-align: center;
  color: white;
`;
const LoaderB = styled.div`
  width: 100%;
  height: 60px;
  position: relative;
`;
const Loader = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50px;
  border: 7px solid #ffffffaa;
  border-top: 7px solid #ffffff33;
  animation: ${LoadKeyframe} 1s ease infinite;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;

const FPPopup = ({popupOn, onClose}: PropsIF) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const close = () => {
    if(onClose) onClose(false);
  }

  const sendPwd = (e: any) => {
    e.preventDefault();
    if(!email) return;
    setIsLoading(true);

    api.post('/auth/forgetPwd', { email })
    .then(({data}) => {
      setIsLoading(false);
      if(data.success) toast.success("?????? ??????????????? ?????????????????????.");
      else return toast.warning(data.message);
      onClose(false);
    });
  }

  return (
    <Blinder isOn={popupOn} pst='absolute'>
      <Container isOn={popupOn}>
        <Title>??????????????? ?????????????????????!!</Title>
        <EmailForm onSubmit={sendPwd}>
          <EmailFieldBox>
            <EmailField
            type="email"
            onChange={(e) => {setEmail(e.target.value);}}
            value={email}
            placeholder="????????? ??????" />
            <span>???????????? ???????????? ??????????????? ????????? ??????????????????.</span>
          </EmailFieldBox>
          <FPSubmit type="submit" value="?????? ???????????? ??????" />
        </EmailForm>
        <OutGo type="button" value="????????? ????????????" onClick={close} />
      </Container>
      <LoaderContainer isLoading={isLoading}>
        <LoaderBox>
          <LoaderB><Loader /></LoaderB>
          <span>????????? ?????? ??? ?????????.</span>
        </LoaderBox>
      </LoaderContainer>
    </Blinder>
  );
}

export default FPPopup;