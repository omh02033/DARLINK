import React from 'react';
import MirrorBall from 'stylesheets/images/Loading.gif';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import styled from '@emotion/styled';

const Container = styled.div<{status: TransitionStatus}>`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: opacity 0.3s ease;
    opacity: ${({status}) => (status === 'entered' ? 1 : 0)}
`;

const LoadingBox = styled.div`
    width: 50%;
    height: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
`;

const LoadingGif = styled.img`
    width: 50%;
`;
const Text = styled.span`
    font: 40px/30px Apple SD Gothic Neo B;
    color: white;
`;


interface LoadingProps {
    show?: boolean;
}

const Loading: React.FC<LoadingProps> = ({show = false}) => {
    return (
        <Transition in={show} timeout={500} unmountOnExit>
            {status => (
                <Container status={status}>
                    <LoadingBox>
                        <LoadingGif src={MirrorBall} />
                        <Text>로딩중</Text>
                    </LoadingBox>
                </Container>
            )}
        </Transition>
    );
}

export default Loading;