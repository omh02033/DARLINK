import { useState } from 'react';
import styled from '@emotion/styled';
import { api } from 'api';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Blinder, Container, Title, CloseBox, PropsIF } from '../partial';
import { BsXLg } from 'react-icons/bs';

const AddForm = styled.form`
  width: 80%;
  height: 70%;
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

const AddLink = ({popupOn, onClose}: PropsIF) => {
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
    {value: 'delivery', label: '????????????'},
    {value: 'direct', label: '????????????'}
  ];

  const deliFieldOptions = [
    {value: 'food', label: '??????'},
    {value: 'etc', label: '????????????'},
    {value: 'reporters', label: '?????????'},
    {value: 'beauty', label: '??????'}
  ];

  const directLocationOptions = [
    {value: 'seoul', label: '??????'},
    {value: 'gyeonggi', label: '?????????'},
    {value: 'junla', label: '?????????'},
    {value: 'gangwon', label: '?????????'},
    {value: 'gyeongsang', label: '?????????'}
  ];
  const directFieldOptions = [
    {value: 'food', label: '?????????'},
    {value: 'sports', label: '?????????'},
    {value: 'caffee', label: '??????'},
    {value: 'etc', label: '??????'}
  ];

  const AddSubmit = (e: any) => {
    e.preventDefault();
    if(!url) return toast.error('????????? ????????? ??????????????????.');
    if(fileWhether && !imgFile) return toast.error('????????? ????????? ??????????????????.');
    if(!fileWhether && !imgUrl) return toast.error('????????? ????????? ????????? ??????????????????.');

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
        toast.success('?????? ????????? ??????????????????.');
        window.location.replace(window.location.href);
      } else toast.error(data.message);
    });
  }
  const checkImgType = (e: any) => {
    if(e.target.files[0].type.indexOf('image') === -1) return toast.error('????????? ????????? ????????? ???????????????.');
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

  const closePopup = () => {
    onClose(false);
  }

  return (
    <Blinder isOn={popupOn} pst='fixed'>
      <Container isOn={popupOn}>
        <Title>?????? ??????</Title>
        <AddForm onSubmit={AddSubmit}>
          <FieldSelector
          options={fieldOptions}
          isSearchable={false}
          defaultValue={fieldOptions[0]}
          onChange={changeField}
          />
          <Field
          type="text"
          placeholder='??????'
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
              <span>??????</span>
            </ToggleWrapper>
            {fileWhether ? (
              <ImgField
              type="file"
              placeholder="????????? ??????"
              onChange={checkImgType}
              />
            ) : (
              <ImgField
              type="url"
              placeholder="????????? url"
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
          value="??????" />
        </AddForm>
        <CloseBox onClick={closePopup}>
          <BsXLg/>
        </CloseBox>
      </Container>
    </Blinder>
  );
}

export default AddLink;