import { useState, useEffect, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { api } from 'api';
import { BsXLg, BsChevronLeft, BsChevronRight, BsFillTrashFill } from 'react-icons/bs';
import { Blinder, Container, Title, CloseBox, PropsIF } from '../partial';


const BannerForm = styled.form`
  width: 720px;
  height: 315px;
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

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
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
  top: calc(50% - 7.5px);
  width: 30px;
  height: 300px;
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
  top: calc(50% - 7.5px);
  width: 30px;
  height: 300px;
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
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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

const UrlBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;
const UrlInput = styled.input`
  width: 70%;
  padding: 10px;
  background: #0002;
  border-radius: 10px;
`;
const UrlSbmBtn = styled.input`
  width: 40%;
  padding: 10px;
  border-radius: 10px;
  background: #ffe0e0;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: pointer;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  }
`;

const DelBtn = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000cc;
  transition: all .3s ease;
  opacity: 0;
  z-index: 100;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;
const DelIcon = styled(BsFillTrashFill)`
  width: 40px;
  height: 40px;
  color: #ff4848;
`;

const ToggleInput = styled.input`
  display: none;
  &:checked + label {
    &:before {
      transform: translate(19px, -50%);
    }
  }
`;
const ToggleWrapper = styled.div`
  flex: 1 1 calc(100% / 3);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
  position: absolute;
  top: 20%;
  width: 150px;
  @media (max-width: 960px) {
    flex: 1 1 calc(100% / 2);
  }
  @media (max-width: 700px) {
    flex: 1 1 100%;
  }
`;
const ToggleLabel = styled.label`
  background: transparent;
  border: 3px solid #000;
  height: 20px;
  width: 45px;
  display: inline-block;
  border-radius: 50px;
  position: relative;
  transition: all 0.3s ease;
  transform-origin: 20% center;
  cursor: pointer;
  padding: 5px;
  &:before {
    border: 3px solid #000;
    width: 5px;
    height: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: #000;
    display: block;
    position: absolute;
    border-radius: 2em;
    transition: all .3s ease;
    content: '';
  }
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
  uid: number;
  path: string;
};
const SetBanner = ({popupOn, onClose}: PropsIF) => {
  const [banners, setBanners] = useState<Array<banner>>([]);
  const [nowPage, setNowPage] = useState<number>(0);

  const dragRef = useRef<HTMLLabelElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);

  const [isFile, setIsFile] = useState<boolean>(true);

  const [url, setUrl] = useState<string>('');

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

  const onChangeFiles = useCallback((e?: React.ChangeEvent<HTMLInputElement> | any): void => {
    const frm = new FormData();
    if(isFile) {
      let file;
    
      if(e.type === 'drop') {
        file = e.dataTransfer.files[0];
      } else {
        file = e.target.files[0];
      }
    
      frm.append('file', file);
    } else {
      frm.append('url', url);
    }
    frm.append('isFile', JSON.stringify(isFile));

    api.post('/manage/banner', frm, {
      headers: {
        "Content-Type": "multipart/form-data; ",
      },
      onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      }
    })
    .then(({data}) => {
      if(data.success) {
        bannerLoad();
        setTimeout(() => {setProgress(null);}, 800);
      }
    });
    setUrl('');
  }, [banners, isFile, url]);

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
        {nowPage === banners?.length && (
          <ToggleWrapper>
            <span>url</span>
            <ToggleInput
            id="imgFile"
            type="checkbox"
            onChange={({ target: {checked} }) => {setIsFile(checked);}}
            checked={isFile} />
            <ToggleLabel htmlFor="imgFile" />
            <span>파일</span>
          </ToggleWrapper>
        )}
        <BannerForm>
          <PrevBtn onClick={PrevBanner} />
          <NextBtn onClick={NextBanner} />
          <BannerContainer pages={banners?.length+1} nowPage={nowPage}>
            {banners.map((banner, idx) => {
              return (
                <BannerBox key={idx}>
                  <div>
                    <DelBtn onClick={() => {delBanner(banner.uid);}}><DelIcon /></DelBtn>
                    <img src={`${banner.path.substring(0, 1) === '/' ? process.env.REACT_APP_BACK_URL : ''}${banner.path}`} />
                  </div>
                </BannerBox>
              );
            })}
            <BannerBox>
              {isFile ? (
                <>
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
                </>
              ) : (
                <UrlBox>
                  <UrlInput
                    type='url'
                    value={url}
                    onChange={({target: {value}}) => {setUrl(value);}}
                    placeholder='이미지 url'
                  />
                  <UrlSbmBtn type="button" value='제출' onClick={onChangeFiles} />
                </UrlBox>
              )}
            </BannerBox>
          </BannerContainer>
          {banners.length !== nowPage && (
            <DotBox>
              {banners.map((banner, idx) => {
                return (
                  <Dot key={idx+100} className={nowPage === idx ? 'active' : ''} />
                );
              })}
            </DotBox>
          )}
        </BannerForm>
        <CloseBox onClick={closePopup}>
          <BsXLg/>
        </CloseBox>
      </Container>
    </Blinder>
  );
}

export default SetBanner;