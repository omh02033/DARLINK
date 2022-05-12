import React, { useEffect, useState } from 'react';
import { api } from 'api';
import styled from '@emotion/styled';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const Container = styled.div`
  width: 720px;
  height: 315px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const PrevBtn = styled(BsChevronLeft)`
  position: absolute;
  left: 0;
  transform: translateY(-50%);
  top: calc(50% - 15px);
  width: 30px;
  height: calc(100% - 15px);
  z-index: 1000;
  cursor: pointer;
  &:hover {
    background: #00000033;
    backdrop-filter: blur(3px);
  }
`;
const NextBtn = styled(BsChevronRight)`
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  top: calc(50% - 15px);
  width: 30px;
  height: calc(100% - 15px);
  z-index: 1000;
  cursor: pointer;
  &:hover {
    background: #00000022;
    backdrop-filter: blur(3px);
  }
`;

const BannerContainer = styled.div<{pages: number, nowPage: number}>`
  width: ${({pages}) => pages*100}%;
  overflow: hidden;
  height: 300px;
  position: absolute;
  left: ${({nowPage}) => nowPage*720*-1}px;
  transition: all .3s ease;
  display: flex;
`;
const BannerBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const NothingBanner = styled.div`
  width: 100%;
  height: 100%;
`;

const DotBox = styled.div`
  position: absolute;
  bottom: 0px;
  height: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #00000033;
  border-radius: 50%;
  margin: 0 10px;
  transition: all .2s ease;
  &.active {
    width: 10px;
    height: 10px;
    background: #000000;
  }
`;

interface banner {
  path: string;
};

const Main: React.FC = () => {
  const [banners, setBanners] = useState<Array<banner>>([]);
  const [nowPage, setNowPage] = useState<number>(0);

  const PrevBanner = () => {
    setNowPage(prevData => {
      if(prevData <= 0) {
        return banners.length-1;
      } else {
        return prevData-1;
      }
    });
  };
  const NextBanner = () => {
    setNowPage(prevData => {
      if(prevData >= banners.length-1) {
        return 0;
      } else {
        return prevData+1;
      }
    });
  };

  useEffect(() => {
    api.get('/link/banner')
    .then(({data}) => {
      setBanners(data.banners);
    });
  }, []);

  return (
    <Container>
      {banners.length > 0 ? (
        <>
          <PrevBtn onClick={PrevBanner} />
          <NextBtn onClick={NextBanner} />
          <BannerContainer pages={banners?.length === 0 ? 1 : banners?.length} nowPage={nowPage}>
            {banners.map((banner, idx) => {
              return (
                <BannerBox key={idx}>
                  <img src={`${banner.path.substring(0, 1) === '/' ? process.env.REACT_APP_BACK_URL : ''}${banner.path}`} />
                </BannerBox>
              );
            })}
          </BannerContainer>
        </>
      ) : (
        <NothingBanner />
      )}
      <DotBox>
        {banners.map((banner, idx) => {
          return (
            <Dot key={idx+100} className={nowPage === idx ? 'active' : ''} />
          );
        })}
      </DotBox>
    </Container>
  );
}
export default Main;