import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  background: #ffffff;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Main: React.FC = () => {
  return (
    <Container>
      <span>BANNER</span>
    </Container>
  );
}
export default Main;