import React, { useState, useEffect } from 'react';
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

const Selector = styled(MultipleSelector)`
  position: absolute;
  top: 0;
  right: 60px;
`;

const CardColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const DeliExperience: React.FC = () => {
  const isLogin = useAuth();
  const [field, setField] = useState<string[]>(['food', 'etc', 'reporters', 'beauty']);

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
    api.get('/link/likes')
    .then(data => {
      const likes: number[] = [];
      data.data.links.forEach((v: number) => {
        likes.push(v);
      });
      setMyLikes(likes);
    })
  }, []);

  useEffect(() => {
    api.post('/link/delivery', {tag: field, page: 0})
    .then(data => {
      setLinks(data.data.links);
    });
  }, [field]);

  useEffect(() => {
    const process: [linkIF[]] = [[]];
    process.slice(0,1);
    for(let i=0; i<links.length; i+=3) {
      const inProcess = [];
      inProcess.push(links[i], links[i+1], links[i+2]);
      process.push(inProcess.filter(element => element !== undefined));
    }
    setProcessLink(process);
  }, [links]);

  return (
    <Container>
      <Selector
        options={field}
        setOptions={setField}
        constValue={['food', 'etc', 'reporters', 'beauty']}
        name={names}
        title={field.length === 4 ? '전체' : field.map((v: string) => { return `${names[v]} `; }).join(',')}
      />

      {processLink?.map((data, idx) => {
        return (
          <CardColumn>
            {data.map((link, i) => {
              return (
                <Card
                  isLogin={isLogin.user ? true : false}
                  isLike={myLikes.includes(link.uid)}
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
export default DeliExperience;