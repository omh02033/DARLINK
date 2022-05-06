import styled from "@emotion/styled";

export const Blinder = styled.div<{isOn: boolean, pst: string}>`
  width: 100vw;
  height: 100vh;
  position: ${({pst}) => pst};
  top: 0;
  left: 0;
  background: ${({isOn}) => isOn ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'};
  z-index: ${({isOn}) => isOn ? 10 : -1};
  opacity: ${({isOn}) => isOn ? 1 : 0};
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Container = styled.div<{isOn: boolean}>`
  background: #fff;
  border-radius: 15px;
  overflow: none;
  width: ${({isOn}) => isOn ? 60 : 0}%;
  height: ${({isOn}) => isOn ? 60 : 0}%;
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

export const Title = styled.span`
  font: 30px Sandoll Gothic M;
`;