import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { api, removeCookie } from 'api';
import Card from 'components/Card';
import { likesIF, linkIF } from 'interfaces/link';
import useAuth from 'hook/auth';
import CPPopup from 'components/popup/changePasswd';

const Container = styled.div`
  width: 100%;
`;

const Box = styled.div<{ bottom: number }>`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${({ bottom }) => ( `${bottom}px;` )};
  position: relative;
`;

const WellCome = styled.span`
  font: 1.5em Sandoll Gothic M;
`;

const Title = styled.div`
  position: absolute;
  width: 75%;
  font: 1.3em Sandoll Gothic L;
  top: -10px;
`;

const MyLikesContainer = styled.div`
  overflow-x: auto;
  display: flex;
  width: 80%;
  height: 250px;
  align-items: center;
  & div {
    margin: 0 30px;
    width: 180px;
  }
`;

const LogOut = styled.div`
  cursor: pointer;
  border: 2px solid #ff7575;
  background: none;
  border-radius: 10px;
  width: 150px;
  padding: 5px;
  font: 1em Sandoll Gothic M;
  text-align: center;
  transition: all 0.2s ease;
  &:hover {
    background: #ff7575;
    color: #fff;
  }
`;

const CP = styled.span`
  border-bottom: 1px solid #000;
  font: .9em Sandoll Gothic L;
  cursor: pointer;
`;

const MyPage: React.FC = () => {
  const isLogin = useAuth();
  const [links, setLinks] = useState<linkIF[]>([]);
  const [myLikes, setMyLikes] = useState<number[]>([]);

  const [CPpopupOn, setCPPopupOn] = useState<boolean>(false);

  useEffect(() => {
    api.get('/user/likes')
    .then(data => {
      setLinks(data.data.links);
    });
    api.get('/link/likes')
    .then(data => {
      const likes: number[] = [];
      data.data.likes.forEach((v: likesIF) => {
        likes.push(v.linkUid);
      });
      setMyLikes(likes);
    })
  }, []);

  const Logout = () => {
    removeCookie('token');
    window.location.replace('/');
  }
  
  const ChangePwd = () => {
    setCPPopupOn(true);
  }

  return (
    <Container>
      <Box bottom={50}>
        <WellCome>{isLogin.user?.name} 고객님 환영합니다.</WellCome>
      </Box>
      {links.length > 0 && (
        <Box bottom={50}>
          <Title>내가 관심있는 캠페인</Title>
          <MyLikesContainer>
            {links?.map((link, i) => {
              return (
                <Card
                  isLogin={isLogin.user ? true : false}
                  isLike={myLikes}
                  setIsLike={setMyLikes}
                  link={link}
                  key={i}
                />
              )
            })}
          </MyLikesContainer>
        </Box>
      )}
      <Box bottom={15}>
        <LogOut onClick={Logout}>로그아웃</LogOut>
      </Box>
      <Box bottom={50}>
        <CP onClick={ChangePwd}>비밀번호 변경</CP>
      </Box>
      <CPPopup
        popupOn={CPpopupOn}
        onClose={setCPPopupOn}
      />
    </Container>
  );
}
export default MyPage;