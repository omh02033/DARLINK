import { useState } from 'react';
import styled from '@emotion/styled';
import { BsHeartFill, BsHeart } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { api } from 'api';
import type { linkIF } from 'interfaces/link';

const Container = styled.div`
  width: 180px;
  height: 200px;
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background: #fff;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Image = styled.img`
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
`;

const Bar = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #000;
  padding: 0 10px;
`;

const Title = styled.span`
  width: 80%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font: 1em Sandoll Gothic L;
`;
const Heart = styled(BsHeart)`
  height: 80%;
  cursor: pointer;
`;
const FillHeart = styled(BsHeartFill)`
  fill: #ff0000;
  cursor: pointer;
`;


interface cardIF {
  link: linkIF;
  isLogin: boolean;
  isLike: boolean;
}

const Card = (props: cardIF) => {
  const [isLike, setIsLike] = useState<boolean>(props.isLike);

  const like = () => {
    if(props.isLogin) {
      toast.warning("로그인이 필요한 서비스입니다.");
      window.location.replace('/login');
    } else {
      api.post('/link/like', {
        like: isLike ? false : true,
        uid: props.link.uid
      })
      .then(data => {
        if(data.data.success) {
          setIsLike(isLike ? false : true);
        }
      });
    }
  }

  const goLink = () => {
    window.open(props.link.url);
  }

  return (
    props.link && (
      <Container onClick={goLink}>
        <ImageBox>
          <Image src={`${props.link.image.substring(0, 1) === '/' ? process.env.REACT_APP_BACK_URL : ''}${props.link.image}`} />
        </ImageBox>
        <Bar>
          <Title>{props.link.title}</Title>
          {props.isLogin ? (
            isLike ? (
              <FillHeart onClick={like} />
            ) : (
              <Heart onClick={like} />
            )
          ) : (
            <Heart onClick={like} />
          )}
        </Bar>
      </Container>
    )
  );
}

export default Card;