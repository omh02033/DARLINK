import React, { useState, useEffect } from 'react';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import styled from '@emotion/styled';
import MultipleSelector from 'components/MultipleSelector';
import { api } from 'api';
import type { linkIF, likesIF } from 'interfaces/link';
import Card from 'components/Card';
import useAuth from 'hook/auth';

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const SelectorBox = styled.div`
  position: absolute;
  top: -60px;
  right: 60px;
  width: 450px;
  display: flex;
  justify-content: space-between;
`;

const CardColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
`;

const DirectExperience: React.FC = () => {
  const isLogin = useAuth();
  const [location, setLocation] = useState<string[]>(['seoul', 'gyeonggi', 'junla', 'gangwon', 'gyeongsang']);
  const [tag, setTag] = useState<string[]>(['food', 'sports', 'caffee', 'etc']);
  const [page, setPage] = useState<number>(0);
  const [pageEnd, setPageEnd] = useState<boolean>(false);

  const directLocationOptions: any = {
    seoul: '서울',
    gyeonggi: '경기도',
    junla: '전라도',
    gangwon: '강원도',
    gyeongsang: '경상도'
  };
  const directTagOptions: any = {
    food: '음식점',
    sports: '스포츠',
    caffee: '카페',
    etc: '기타'
  };

  const [links, setLinks] = useState<linkIF[]>([]);
  const [processLink, setProcessLink] = useState<[linkIF[]]>();
  const [myLikes, setMyLikes] = useState<number[]>([]);

  useEffect(() => {
    if(isLogin.user) {
      api.get('/link/likes')
      .then(({data}) => {
        const likes: number[] = [];
        data.likes.forEach((v: likesIF) => {
          likes.push(v.linkUid);
        });
        setMyLikes(likes);
      });
    }
  }, []);

  useEffect(() => {
    api.post('/link/direct', {location, tag, page: 0})
    .then(({data}) => {
      setLinks(data.links);
      setPage(0);
    });
  }, [tag, location]);

  useEffect(() => {
    const process: [linkIF[]] = [[]];
    process.shift();
    for(let i=0; i<links.length; i+=3) {
      const inProcess = [];
      inProcess.push(links[i], links[i+1], links[i+2]);
      process.push(inProcess.filter(element => element !== undefined));
    }
    setProcessLink(process);
  }, [links]);

  useBottomScrollListener(() => {
    if(!pageEnd) {
      api.post('/link/direct', {location, tag, page: page+1})
      .then(({data}) => {
        if(data.links.length > 0) {
          setPage(prev => { return prev+1 });
          setLinks(prev => {
            return [
              ...prev,
              ...data.links
            ];
          });
        } else setPageEnd(true);
      });
    }
  });

  return (
    <Container>
      <SelectorBox>
        <MultipleSelector
          options={location}
          setOptions={setLocation}
          constValue={['seoul', 'gyeonggi', 'junla', 'gangwon', 'gyeongsang']}
          name={directLocationOptions}
          title={location.length === 5 ? '전체' : location.map((v: string) => { return `${directLocationOptions[v]}`; }).join(',')}
        />
        <MultipleSelector
          options={tag}
          setOptions={setTag}
          constValue={['food', 'sports', 'caffee', 'etc']}
          name={directTagOptions}
          title={tag.length === 4 ? '전체' : tag.map((v: string) => { return `${directTagOptions[v]}`; }).join(',')}
        />
      </SelectorBox>

      {processLink?.map((data, idx) => {
        return (
          <CardColumn key={idx}>
            {data.map((link, i) => {
              return (
                <Card
                  isLogin={isLogin.user || false}
                  isLike={myLikes}
                  setIsLike={setMyLikes}
                  link={link}
                  key={idx+i}
                />
              )
            })}
          </CardColumn>
        );
      })
    }
    </Container>
  );
}
export default DirectExperience;