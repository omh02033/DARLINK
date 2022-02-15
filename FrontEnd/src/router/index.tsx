import React, { Suspense } from 'react';
import { useLocation, Navigate, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuth from 'hook/auth';
import Loading from 'components/Loading';
import { LoadableComponent } from '@loadable/component';
import {
    Login,
    Main
} from 'pages';
import styled from '@emotion/styled';
import linkLogo from 'stylesheets/images/link.png';
import { BsBoxSeam, BsHandIndex } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: #fef4ed;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    transition: all 0.4s ease;
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
    transition: all 1s ease;
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
    transition: all 0.4s ease;
    &:hover {
        height: 100%;
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
const MenuTitle = styled.span<{main: boolean}>`
    width: 100%;
    text-align: center;
    font: ${({main}) => main ? 1.5 : 1.2}em Sandoll Gothic B;
    transition: all 0.4s ease;
`;

const PageBox = styled.div<{main: boolean}>`
    width: 100%;
    height: ${({main}) => main ? 20 : 50 }%;
    transition: all 0.4s ease;
`;


const needAuth = <PageProps extends {}>(
    Component: LoadableComponent<PageProps>
) => {
    return (params: PageProps) => {
        const auth = useAuth();
        return auth.user ? <Component {...params} /> : <Navigate to='/login' />;
    }
}

const App: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    const isMain = location.pathname === '/';

    return (
        <Suspense fallback={<Loading show />}>
            <Loading show={auth.user === undefined}/>
            <ToastContainer/>
            <Container>
                <TopLogo>
                    <LogoBox to='/'>
                        <LinkImg src={linkLogo} />
                        <Title>DARLINK</Title>
                    </LogoBox>
                </TopLogo>
                <MenuContainer main={isMain}>
                    <MenuBtn to='/deliExperience'>
                        <MenuDelivery />
                        <MenuTitle main={isMain}>배송 체험</MenuTitle>
                    </MenuBtn>
                    <MenuBtn to='/directlyExperience'>
                        <MenuExperience />
                        <MenuTitle main={isMain}>직접 체험</MenuTitle>
                    </MenuBtn>
                    <MenuBtn to={auth.user ? '/myPage' : '/login'}>
                        <MenuMyPage />
                        <MenuTitle main={isMain}>마이페이지</MenuTitle>
                    </MenuBtn>
                </MenuContainer>
                <PageBox main={isMain}>
                    <Routes>
                        <Route path='/' element={<Main />} />
                        <Route path='/login' element={<Login />} />
                    </Routes>
                </PageBox>
            </Container>
        </Suspense>
    );
}

export default App;