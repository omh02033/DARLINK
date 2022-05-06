import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { BsHeartFill, BsHeart, BsFillTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { api } from 'api';
import type { likesIF, linkIF } from 'interfaces/link';
import { User } from 'hook/auth';

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
  transition: all 0.3s ease;
  position: relative;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
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

const DelBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 30px;
  transition: all .2s ease;
  position: absolute;
  z-index: 100;
  right: 0px;
  top: 0px;
  cursor: pointer;
  &:hover {
    background: #00000022;
  }
`;
const DelIcon = styled(BsFillTrashFill)`
  width: 20px;
  height: 20px;
  color: #ff4848;
`;


interface cardIF {
  link: linkIF;
  isLogin: User | false;
  isLike: number[];
  setIsLike: React.Dispatch<React.SetStateAction<number[]>>;
}

const Card = (props: cardIF) => {
  const like = () => {
    if(!props.isLogin) {
      toast.warning("로그인이 필요한 서비스입니다.");
      setTimeout(() => {
        window.location.replace('/login');
      }, 1000);
    } else {
      api.post('/link/like', {
        like: props.isLike.includes(props.link.uid) ? false : true,
        uid: props.link.uid
      })
      .then(({data}) => {
        if(data.success) {
          const likes: number[] = [];
          data.likes.forEach((v: likesIF) => {
            likes.push(v.linkUid);
          });
          props.setIsLike(likes);
          toast.success(data.message);
        }
      });
    }
  }

  const goLink = () => {
    window.open(props.link.url);
  }

  const delLink = () => {
    api.delete('/manage/link', {
      data: {
        uid: props.link.uid,
      },
    })
    .then(({data}) => {
      if(data.success) {
        window.location.replace(window.location.href);
      }
    });
  }

  return (
    props.link && (
      <Container>
        <ImageBox onClick={goLink}>
          <Image src={`${props.link.image.substring(0, 1) === '/' ? process.env.REACT_APP_BACK_URL : ''}${props.link.image}`} />
        </ImageBox>
        <Bar>
          <Title>{props.link.title}</Title>
          {props.isLogin ? (
            props.isLike.includes(props.link.uid) ? (
              <FillHeart onClick={like} />
            ) : (
              <Heart onClick={like} />
            )
          ) : (
            <Heart onClick={like} />
          )}
        </Bar>
        {(props.isLogin as User).manager && (
          <DelBtn onClick={delLink}><DelIcon /></DelBtn>
        )}
      </Container>
    )
  );
}

export default Card;