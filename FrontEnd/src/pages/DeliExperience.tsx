import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import MultipleSelector from 'components/MultipleSelector';
import { api } from 'api';
import type { linkIF, likesIF } from 'interfaces/link';
import Card from 'components/Card';
import useAuth from 'hook/auth';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const SelectorBox = styled.div`
  position: absolute;
  top: -60px;
  right: 60px;
  display: flex;
  justify-content: space-between;
`;

const CardColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  border-bottom: 20px;
`;

const DeliExperience: React.FC = () => {
  const isLogin = useAuth();
  const [field, setField] = useState<string[]>(['food', 'etc', 'reporters', 'beauty']);
  const [page, setPage] = useState<number>(0);

  const names: any = {
    food: '음식',
    etc: '기타제품',
    reporters: '기자단',
    beauty: '뷰티'
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
    api.post('/link/delivery', {tag: field, page: 0})
    .then(({data}) => {
      setLinks(data.links);
    });
  }, [field]);

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
    api.post('/link/delivery', {tag: field, page: page+1})
    .then(({data}) => {
      setPage(prev => { return prev+1 });
      setLinks(prev => {
        return [
          ...prev,
          ...data.links
        ];
      });
    });
  });

  return (
    <Container>
      <SelectorBox>
        <MultipleSelector
          options={field}
          setOptions={setField}
          constValue={['food', 'etc', 'reporters', 'beauty']}
          name={names}
          title={field.length === 4 ? '전체' : field.map((v: string) => { return `${names[v]}`; }).join(',')}
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
        )
      })
    }
    </Container>
  );
}
export default DeliExperience;