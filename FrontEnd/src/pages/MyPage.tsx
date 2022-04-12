import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { api, removeCookie } from 'api';
import Card from 'components/Card';
import { likesIF, linkIF } from 'interfaces/link';
import useAuth from 'hook/auth';
import CPPopup from 'components/popup/changePasswd';
import Calendar from 'react-calendar';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

import 'react-calendar/dist/Calendar.css';

moment.tz.setDefault('Asia/Seoul');

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

const AttendanceCaldendar = styled(Calendar)`
  margin: 20px auto;
  width: 30%;
  border-radius: 10px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  margin-bottom: 20px;
  & button {
    position: relative;
  }
`;

const Dot = styled.div`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 0, 0, 0.8);
`;

const AttendanceBtn = styled.button`
  background: none;
  border: 2px solid #000;
  border-radius: 50px;
  padding: 10px;
  width: 200px;
  color: #000;
  cursor: pointer;
  transition: all .3s ease;
  &:hover {
    color: #fff;
    background-color: #000000aa;
  }
`;

const MyPage: React.FC = () => {
  const isLogin = useAuth();
  const [links, setLinks] = useState<linkIF[]>([]);
  const [myLikes, setMyLikes] = useState<number[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [mark, setMark] = useState<string[]>(['2022-04-11']);

  const [CPpopupOn, setCPPopupOn] = useState<boolean>(false);

  useEffect(() => {
    api.get('/user/likes')
    .then(({data}) => {
      setLinks(data.links);
    });
    api.get('/link/likes')
    .then(({data}) => {
      const likes: number[] = [];
      data.likes.forEach((v: likesIF) => {
        likes.push(v.linkUid);
      });
      setMyLikes(likes);
    });

    api.get('/user/attendance')
    .then(({data}) => {
      setMark(data.attendance);
    })
  }, []);

  const Logout = () => {
    removeCookie('token');
    window.location.replace('/');
  }
  
  const ChangePwd = () => {
    setCPPopupOn(true);
  }

  const attendance = () => {
    api.post('/user/attendance')
    .then(({data}) => {
      if(data.success) {
        toast.success(`${data.day} 출석체크 하였습니다.`);
        setMark(prev => {
          return [
            ...prev,
            data.day
          ];
        });
      }
    });
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
      <Box bottom={20}>
        <Title>출석체크</Title>
        <AttendanceCaldendar
        onChange={setDate}
        formatDay={(locale, date) => moment(date).format("DD")}
        value={date}
        tileContent={({ date, view }) => {
          if (mark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
            return (
             <Dot />
           );
          } else return (<></>);
        }}
        />
      </Box>
      <Box bottom={70}>
        <AttendanceBtn onClick={attendance}>출석체크 하기</AttendanceBtn>
      </Box>
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