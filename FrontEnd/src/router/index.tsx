import React, { Suspense } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuth from 'hook/auth';
import Loading from 'components/Loading';
import styled from '@emotion/styled';
import linkLogo from 'stylesheets/images/link.png';
import { BsBoxSeam, BsHandIndex } from 'react-icons/bs';
import { AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
import PrivateRouter from './privateRouter';
import PublicRouter from './publicRouter';

import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: #fef4ed;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    transition: all 0.3s ease;
    position: relative;
`;
const TopLogo = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const LogoBox = styled(Link)`
    width: 50%;
    height: 100%;
    color: black;
    text-decoration: none;
    position: relative;
    & * {
        cursor: pointer;
    }
`;
const LinkImg = styled.img`
    height: 100%;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
`;
const Title = styled.span`
    font: 40px Sandoll Gothic B;
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    z-index: 2;
    letter-spacing: 10px;
`;

const MenuContainer = styled.div<{main: boolean}>`
    width: ${({main}) => main ? 50 : 30}%;
    height: ${({main}) => main ? 20 : 10}%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    transition: all 0.3s ease;
`;
const MenuBtn = styled(Link)`
    height: 80%;
    width: 25%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    color: black;
    text-decoration: none;
    transition: all 0.3s ease;
    &:hover {
        height: 100%;
    }
    &.active {
        height: 110%;
    }
`;
const MenuDelivery = styled(BsBoxSeam)`
    width: 100%;
    height: 50%;
`;
const MenuExperience = styled(BsHandIndex)`
    width: 100%;
    height: 50%;
`;
const MenuMyPage = styled(AiOutlineUser)`
    width: 100%;
    height: 50%;
`;
const MenuAdmin = styled(AiOutlineSetting)`
    width: 100%;
    height: 50%;
`;
const MenuTitle = styled.span<{main: boolean}>`
    width: 100%;
    text-align: center;
    font: ${({main}) => main ? 1.5 : 1.2}em Sandoll Gothic B;
    transition: all 0.3s ease;
`;

const PageBox = styled.div<{main: boolean}>`
    width: 100%;
    height: ${({main}) => main ? 20 : 50 }%;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
`;

const Boundary = styled.div<{main: boolean}>`
    width: 30%;
    border: 2px solid black;
    opacity: ${({main}) => main ? 0 : 1};
    transition: all 0.2s ease;
`;

const App: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    const isMain = location.pathname === '/';

    const myPageActiveField = ["/login", "/myPage", "/signup"];
    const directActiveField = ["/directExperience"];
    const deliActiveField = ["/deliExperience"];
    const manageActiveField = ["/manage"];

    return (
        <Suspense fallback={<Loading show />}>
            <Loading show={auth?.user === undefined}/>
            <ToastContainer/>
            <Container>
                <TopLogo>
                    <LogoBox to='/'>
                        <LinkImg src={linkLogo} />
                        <Title>DARLINK</Title>
                    </LogoBox>
                </TopLogo>
                <MenuContainer main={isMain}>
                    <MenuBtn
                    to='/deliExperience'
                    className={deliActiveField.indexOf(location.pathname) !== -1 ? 'active' : ''}>
                        <MenuDelivery />
                        <MenuTitle main={isMain}>배송 체험</MenuTitle>
                    </MenuBtn>
                    <MenuBtn
                    to='/directExperience'
                    className={directActiveField.indexOf(location.pathname) !== -1 ? 'active' : ''}>
                        <MenuExperience />
                        <MenuTitle main={isMain}>직접 체험</MenuTitle>
                    </MenuBtn>
                    <MenuBtn
                    to={auth?.user ? '/myPage' : '/login'}
                    className={myPageActiveField.indexOf(location.pathname) !== -1 ? 'active' : ''}>
                        <MenuMyPage />
                        <MenuTitle main={isMain}>마이페이지</MenuTitle>
                    </MenuBtn>
                    {auth?.user?.isAdmin && (
                        <MenuBtn
                        to='/manage'
                        className={manageActiveField.indexOf(location.pathname) !== -1 ? 'active' : ''}>
                            <MenuAdmin />
                            <MenuTitle main={isMain}>관리</MenuTitle>
                        </MenuBtn>
                    )}
                </MenuContainer>
                <Boundary main={isMain} />
                <PageBox main={isMain}>
                    {auth?.user ? <PrivateRouter /> : <PublicRouter />}
                </PageBox>
            </Container>
        </Suspense>
    );
}

export default App;