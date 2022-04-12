import React, { useState } from 'react';
import Select from 'react-select';
import styled from '@emotion/styled';
import { api } from 'api';
import { toast } from 'react-toastify';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddForm = styled.form`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  position: relative;
`;
const Field = styled.input`
  padding: 10px;
  border-radius: 10px;
  background: #00000022;
  width: 50%;
`;
const ImgField = styled(Field)`
  width: 100%;
`;
const ImgBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: column;
  width: 50%;
`;
const ToggleInput = styled.input`
  display: none;
  &:checked + label {
    &:before {
      transform: translate(29px, -50%);
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
  position: relative;
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
  height: 30px;
  width: 60px;
  display: inline-block;
  border-radius: 50px;
  position: relative;
  transition: all 0.3s ease;
  transform-origin: 20% center;
  cursor: pointer;
  padding: 5px;
  &:before {
    border: 3px solid #000;
    width: 10px;
    height: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: #000;
    display: block;
    position: absolute;
    border-radius: 2em;
    transition: all 0.3s ease;
    content: '';
  }
`;
const FieldSelector = styled(Select)`
  width: 50%;
`;
const SubmitBtn = styled.input`
  width: 50%;
  padding: 15px;
  background: #ffe0e0;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: pointer;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  }
`;

const Manage: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [fileWhether, setFileWhether] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [imgFile, setImgFile] = useState<File>();
  const [location, setLocation] = useState<string>("seoul");
  const [field, setField] = useState<string>("food");
  const [title, setTitle] = useState<string>("");
  
  const [isDeli, setIsDeli] = useState<boolean>(true);
  const [isDirect, setIsDirect] = useState<boolean>(false);

  const fieldOptions = [
    {value: 'delivery', label: '배송체험'},
    {value: 'direct', label: '직접체험'}
  ];

  const deliFieldOptions = [
    {value: 'food', label: '음식'},
    {value: 'etc', label: '기타제품'},
    {value: 'reporters', label: '기자단'},
    {value: 'beauty', label: '뷰티'}
  ];

  const directLocationOptions = [
    {value: 'seoul', label: '서울'},
    {value: 'gyeonggi', label: '경기도'},
    {value: 'junla', label: '전라도'},
    {value: 'gangwon', label: '강원도'},
    {value: 'gyeongsang', label: '경상도'}
  ];
  const directFieldOptions = [
    {value: 'food', label: '음식점'},
    {value: 'sports', label: '스포츠'},
    {value: 'caffee', label: '카페'},
    {value: 'etc', label: '기타'}
  ];

  const AddSubmit = (e: any) => {
    e.preventDefault();
    if(!url) return toast.error('올바른 주소을 입력해주세요.');
    if(fileWhether && !imgFile) return toast.error('이미지 파일을 선택해주세요.');
    if(!fileWhether && !imgUrl) return toast.error('올바른 이미지 주소를 입력해주세요.');

    const frm = new FormData();
    frm.append('url', url);
    frm.append('fileWhether', JSON.stringify(fileWhether));
    if(fileWhether) frm.append('file', imgFile as File);
    else frm.append('imgUrl', imgUrl);
    frm.append('location', location);
    frm.append('field', field);
    frm.append('isDeli', JSON.stringify(isDeli));
    frm.append('isDirect', JSON.stringify(isDirect));
    frm.append('title', title);

    api.post('/manage/link', frm, {
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
    })
    .then(({data}) => {
      if(data.success) {
        toast.success('링크 등록에 성공하였어요.');
        window.location.replace(window.location.href);
      } else toast.error(data.message);
    });
  }
  const checkImgType = (e: any) => {
    if(e.target.files[0].type.indexOf('image') === -1) return toast.error('이미지 파일만 업로드 가능합니다.');
    setImgFile(e.target.files[0]);
  }

  const changeField = (e: any) => {
    if(e.value === 'delivery') {
      setIsDeli(true);
      setIsDirect(false);
    } else {
      setIsDeli(false);
      setIsDirect(true);
    }
  }

  return (
    <Container>
      <AddForm onSubmit={AddSubmit}>
        <FieldSelector
        options={fieldOptions}
        isSearchable={false}
        defaultValue={fieldOptions[0]}
        onChange={changeField}
        />
        <Field
        type="text"
        placeholder='제목'
        onChange={({ target: {value} }) => {setTitle(value);}}
        value={title}
        />
        <Field
        type="url"
        placeholder='url'
        onChange={({ target: {value} }) => {setUrl(value);}}
        value={url} />
        <ImgBox>
          <ToggleWrapper>
            <span>url</span>
            <ToggleInput
            id="imgFile"
            type="checkbox"
            onChange={({ target: {checked} }) => {setFileWhether(checked);}}
            checked={fileWhether} />
            <ToggleLabel htmlFor="imgFile" />
            <span>파일</span>
          </ToggleWrapper>
          {fileWhether ? (
            <ImgField
            type="file"
            placeholder="이미지 파일"
            onChange={checkImgType}
            />
          ) : (
            <ImgField
            type="url"
            placeholder="이미지 url"
            onChange={({ target: {value} }) => {setImgUrl(value);}}
            value={imgUrl}
            />
          )}
        </ImgBox>
        {isDirect && (
          <FieldSelector
          options={directLocationOptions}
          isSearchable={false}
          defaultValue={directLocationOptions[0]}
          onChange={(e: any) => {setLocation(e.value);}}
          />
        )}
        <FieldSelector
        options={isDeli ? deliFieldOptions : directFieldOptions}
        isSearchable={false}
        defaultValue={isDeli ? deliFieldOptions[0] : directFieldOptions[0]}
        onChange={(e: any) => {setField(e.value);}} />
        <SubmitBtn
        type="submit"
        value="등록" />
      </AddForm>
    </Container>
  );
}

export default Manage;