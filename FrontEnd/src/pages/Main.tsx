import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { api } from 'api';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const Container = styled.div`
  width: 720px;
  height: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const PrevBtn = styled(BsChevronLeft)`
  position: absolute;
  left: 0;
  transform: translateY(-50%);
  top: 50%;
  width: 30px;
  height: 100%;
  z-index: 1000;
  cursor: pointer;
  &:hover {
    background: #00000033;
    backdrop-filter: blur(10px);
  }
`;
const NextBtn = styled(BsChevronRight)`
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  top: 50%;
  width: 30px;
  height: 100%;
  z-index: 1000;
  cursor: pointer;
  &:hover {
    background: #00000022;
    backdrop-filter: blur(10px);
  }
`;

const BannerContainer = styled.div<{pages: number, nowPage: number}>`
  width: ${({pages}) => pages*100}%;
  overflow: hidden;
  height: 100%;
  position: absolute;
  left: ${({nowPage}) => nowPage*720*-1}px;
  transition: all .3s ease;
  display: flex;
`;
const BannerBox = styled.div`
  width: 720px;
  height: 100%;
  display: flex;
  justify-content: center;
  & img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const NothingBanner = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface banner {
  path: string;
};

const Main: React.FC = () => {
  const [banners, setBanners] = useState<Array<banner>>([]);
  const [nowPage, setNowPage] = useState<number>(0);

  useEffect(() => {
    api.get('/link/banner')
    .then(({data}) => {
      setBanners(data.banners);
    });
  }, []);

  const PrevBanner = () => {
    setNowPage(prevData => {
      if(prevData <= 0) {
        return 0;
      } else {
        return prevData-1;
      }
    });
  };
  const NextBanner = () => {
    setNowPage(prevData => {
      if(prevData >= banners.length-1) {
        return banners.length-1;
      } else {
        return prevData+1;
      }
    });
  };

  return (
    <Container>
      {banners.length > 0 ? (
        <>
          <PrevBtn onClick={PrevBanner} />
          <NextBtn onClick={NextBanner} />
          <BannerContainer pages={banners?.length+1} nowPage={nowPage}>
            {banners.map((banner, idx) => {
              return (
                <BannerBox key={idx}>
                  <img src={`${process.env.REACT_APP_BACK_URL}${banner.path}`} />
                </BannerBox>
              );
            })}
          </BannerContainer>
        </>
      ) : (
        <NothingBanner>배너를 등록해주세요<br />관리 → 배너 관리</NothingBanner>
      )}
    </Container>
  );
}
export default Main;