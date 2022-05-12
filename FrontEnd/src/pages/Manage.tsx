import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Banner, Link } from 'components/popup/manage';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const PopupBtn = styled.div`
  width: 40%;
  height: 80px;
  padding: 15px;
  font-size: 1.3em;
  font-weight: bold;
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: pointer;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  }
`;

const Card = ({
  setPopup,
  title
}:{
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}) => {
  return (
    <PopupBtn onClick={() => {setPopup(true);}}>{title}</PopupBtn>
  );
}

const Manage: React.FC = () => {
  const [isBannerPopup, setIsBannerPopup] = useState<boolean>(false);
  const [isLinkPopup, setIsLinkPopup] = useState<boolean>(false);

  return (
    <Container>
      <Box>
        <Card setPopup={setIsLinkPopup} title='링크 관리' />
        <Card setPopup={setIsBannerPopup} title='배너 관리' />
      </Box>
      <Banner
        popupOn={isBannerPopup}
        onClose={setIsBannerPopup}
      />
      <Link
        popupOn={isLinkPopup}
        onClose={setIsLinkPopup}
      />
    </Container>
  );
}

export default Manage;