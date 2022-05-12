import { useState, useEffect, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { api } from 'api';
import { toast } from 'react-toastify';
import { BsXLg, BsChevronLeft, BsChevronRight, BsFillTrashFill } from 'react-icons/bs';
import { Blinder, Container, Title } from './partial';


const BannerForm = styled.form`
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

const CloseBox = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
  &:hover {
    background: #00000033;
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px dashed black;
  &.Dragging {
    background-color: black;
    color: white;
  }
`;

const ProgressBar = styled.div<{progress: number}>`
  width: 70%;
  height: 10px;
  border-radius: 10px;
  border: 1px solid black;
  position: relative;
  & > div {
    position: absolute;
    background: #dfa377;
    border-radius: 10px;
    height: 100%;
    width: ${({progress}) => progress || 0}%;
    transition: width .1s ease;
  }
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
    backdrop-filter: blur(3px);
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
    backdrop-filter: blur(3px);
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
  align-items: center;
  & > div {
    max-width: 100%;
    max-height: 100%;
    position: relative;
    & img {
      max-width: 100%;
      max-height: 100%;
    }
  }
`;

const DelBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 30px;
  transition: all .2s ease;
  position: absolute;
  z-index: 10000;
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

interface banner {
  uid: number;
  path: string;
};
interface PropsIF {
  popupOn: boolean;
  onClose: Function;
};

const SetBanner = ({popupOn, onClose}: PropsIF) => {
  const [banners, setBanners] = useState<Array<banner>>([]);
  const [nowPage, setNowPage] = useState<number>(0);

  const dragRef = useRef<HTMLLabelElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);

  const bannerLoad = () => {
    api.get('/manage/banner')
    .then(({data}) => {
      setBanners(data.banners);
    });
  }

  useEffect(() => {
    bannerLoad();
  }, []);

  const closePopup = () => {
    onClose(false);
  }

  const onChangeFiles = useCallback((e: React.ChangeEvent<HTMLInputElement> | any): void => {
    let file;

    if(e.type === 'drop') {
      file = e.dataTransfer.files[0];
    } else {
      file = e.target.files[0];
    }

    const frm = new FormData();
    frm.append('file', file);
    api.post('/manage/banner', frm, {
      headers: {
        "Content-Type": "multipart/form-data; ",
      },
      onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total));
        console.log(data.loaded);
        console.log(data.total);
      }
    })
    .then(({data}) => {
      if(data.success) {
        bannerLoad();
        setTimeout(() => {setProgress(null);}, 800);
      }
    });
  }, [banners]);

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if(e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    onChangeFiles(e);
    setIsDragging(false);
  }, [onChangeFiles]);

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

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
      if(prevData >= banners.length) {
        return banners.length;
      } else {
        return prevData+1;
      }
    });
  };

  const delBanner = (uid: number) => {
    api.delete('/manage/banner', {
      data: {
        uid
      },
    })
    .then(({data}) => {
      if(data.success) {
        bannerLoad();
      }
    });
  }

  return (
    <Blinder isOn={popupOn} pst='fixed'>
      <Container isOn={popupOn}>
        <Title>배너 관리</Title>
        <BannerForm>
          <PrevBtn onClick={PrevBanner} />
          <NextBtn onClick={NextBanner} />
          <BannerContainer pages={banners?.length+1} nowPage={nowPage}>
            {banners.map((banner, idx) => {
              return (
                <BannerBox key={idx}>
                  <div>
                    <img src={`${process.env.REACT_APP_BACK_URL}${banner.path}`} />
                    <DelBtn onClick={() => {delBanner(banner.uid);}}><DelIcon /></DelBtn>
                  </div>
                </BannerBox>
              );
            })}
            <BannerBox>
                <input
                type="file"
                style={{display: "none"}}
                id="fileUpload"
                multiple={false}
                onChange={onChangeFiles}
                name="file"
                accept="image/*"
              />
              <Label
                className={isDragging ? 'Dragging' : ''}
                htmlFor="fileUpload"
                ref={dragRef}
              >
                {progress ? (
                  <ProgressBar progress={progress}><div /></ProgressBar>
                ) : (
                  <div>이미지 파일 첨부</div>
                )}
              </Label>
            </BannerBox>
          </BannerContainer>
        </BannerForm>
        <CloseBox onClick={closePopup}>
          <BsXLg/>
        </CloseBox>
      </Container>
    </Blinder>
  );
}

export default SetBanner;