import React, { useState } from 'react';
import styled from '@emotion/styled';
import { BsFillCaretDownFill } from 'react-icons/bs';

const SelectContainer = styled.div`
  width: 200px;
  height: 30px;
  margin: 10px;
  position: relative;
`;
    
const SelectBox = styled.div`
  width: 100%;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &.all {
    border-bottom: 1px solid #00000055;
  }
`;

const SelectBtn = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 6px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  z-index: 20;
  top: 0;
  left: 0;
  & > span {
    display: block;
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    font: 16px/65px Sandoll Gothic M;
    line-height: 100%;
  }
`;
const ToggleIcon = styled(BsFillCaretDownFill)<{isFocus: boolean}>`
  position: absolute;
  height: 70%;
  transform: translate(-50%, -50%) rotate(${({isFocus}) => (isFocus ? '180deg' : '0deg')});
  top: 50%;
  right: 5%;
  transition: all 0.1s ease;
`;
const TargetSelector = styled.div`
  top: 30%;
  transform: translateX(-50%);
  left: 50%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  background: #ffffff;
  position: absolute;
  transition: all 0.2s ease;
  opacity: 0;
  border: 1px solid #00000055;
  border-radius: 10px;
  z-index: -1;
  &.active {
    z-index: 1000;
    display: flex;
    opacity: 1;
    top: 100%;
  }
`;


interface MSIF {
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  name: any;
  constValue: string[];
  title: string;
}

const MultipleSelector = (props: MSIF) => {
  const [showField, setShowF] = useState<boolean>(false);
  
  const activeTarget = (field: boolean, setField: React.Dispatch<React.SetStateAction<boolean>>) => {
    setShowF(false);

    setField(field ? false : true);
  }

  const setData = (data: string, target: string[], setTarget: React.Dispatch<React.SetStateAction<string[]>>) => {
    if(target.includes(data)) {
      setTarget((prevList: string[]) => {
        const filtered = prevList.filter((element) => {return element !== data});
        return [...filtered];
      });
    } else {
      setTarget((prevList: string[]) => {
        const majors = [
          ...prevList,
          data
        ];
        return majors;
      });
    }
  }

  const allChange = () => {
    if(props.options.length === props.constValue.length) props.setOptions([]);
    else props.setOptions(props.constValue);
  }

  return (
    <SelectContainer>
      <SelectBtn onClick={(e) => {activeTarget(showField, setShowF);}}>
        <span>{props.title}</span>
        <ToggleIcon isFocus={showField} />
      </SelectBtn>
      <TargetSelector className={showField ? 'active' : ''}>
        <SelectBox className="all" onClick={() => {allChange();}}>
          <div>전체 선택</div>
          <input type="checkbox" checked={props.options.length === props.constValue.length ? true : false} />
        </SelectBox>
        {props.constValue.map((data: string) => {
          return (
            <SelectBox onClick={() => {setData(data, props.options, props.setOptions);}} key={data+'f'}>
              <div>{props.name[data]}</div>
              <input type="checkbox" checked={props.options.includes(data) ? true : false} />
            </SelectBox>
          );
        })}
      </TargetSelector>
    </SelectContainer>
  )
}

export default MultipleSelector;