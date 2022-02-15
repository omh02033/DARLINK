import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const LoadKeyframe = keyframes`
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
`;

const Container = styled.div<{status: TransitionStatus}>`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: #ffffff;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Box = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    height: 150px;
    text-align: center;
`;
const LoaderBox = styled.div`
    width: 100%;
    height: 60px;
    position: relative;
`;
const Loader = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50px;
    border: 7px solid #000000aa;
    border-top: 7px solid #00000033;
    animation: ${LoadKeyframe} 1s ease infinite;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
`;

interface LoadingProps {
    show?: boolean;
}

const Loading: React.FC<LoadingProps> = ({show = false}) => {
    return (
        <Transition in={show} timeout={500} unmountOnExit>
            {status => (
                <Container status={status}>
                    <Box>
                        <LoaderBox><Loader /></LoaderBox>
                        <span>데이터를 불러오는 중 입니다.</span>
                    </Box>
                </Container>
            )}
        </Transition>
    );
}

export default Loading;