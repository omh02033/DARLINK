import React, { useState } from 'react';
import styled from '@emotion/styled';
import Select from 'react-select';
import { api, setCookie } from 'api';
import { toast } from 'react-toastify';

const Container = styled.div`
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    height: 85%;
`;
const PageTitle = styled.div`
    font: 30px Sandoll Gothic M;
`;
const SignUpForm = styled.form`
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;
const EmailField = styled.div`
    width: 60%;
    display: flex;
    justify-content: space-between;
    & > input {
        width: 55%;
    }
    & > span {
        font: 25px Sandoll Gothic B;
    }
`;
const EmailSelector = styled(Select)`
    width: 35%;
`;

const SignUpField = styled.input`
    width: 60%;
    outline: none;
    border: 1px solid #00000033;
    border-radius: 10px;
    padding: 10px;
`;
const SignUpSubmitBtn = styled.input`
    width: 30%;
    outline: none;
    border: none;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background: #e9b897;
    font: 15px Sandoll Gothic M;
    padding: 10px;
    cursor: pointer;
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    }
`;

const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [emailS, setEmailS] = useState<string>("etc");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPwd, setConfirmPwd] = useState<string>("");

    const emailOptions = [
        {value: 'etc', label: '직접입력'},
        {value: '', label: 'naver.com'},
        {value: '', label: 'gmail.com'},
        {value: '', label: 'hanmail.com'},
        {value: '', label: 'yahoo.com'}
    ]

    const changeEmailOption = (e: any) => {
        if(e.value === 'etc') setEmailS(e.value);
        else setEmailS(e.label);
    }

    const signupSubmit = (e: any) => {
        e.preventDefault();
        if(!email || !name || !password || !confirmPwd) return toast.warning("필드를 확인해주세요.");

        if(password === confirmPwd) {
            const cEmail = emailS === 'etc' ? email : `${email}@${emailS}`;
            api.post("/auth/signup", {
                email: cEmail,
                name,
                password
            })
            .then(res => {
                if(res.data.success) {
                    toast.success("회원가입에 성공했어요.");
                    setCookie('token', res.data.token);
                    window.location.href = '/myPage';
                }
            });
        } else return toast.warning("비밀번호를 확인해주세요.");
    }

    return (
        <Container>
            <PageTitle>달링과 더 많은 체험을 알아보세요!!</PageTitle>
            <SignUpForm onSubmit={signupSubmit}>
                <EmailField>
                    <SignUpField
                    type={emailS === 'etc' ? 'email' : 'text'}
                    onChange={(e) => {setEmail(e.target.value);}}
                    value={email}
                    placeholder='이메일' />
                    <span>@</span>
                    <EmailSelector
                    options={emailOptions}
                    isSearchable={false}
                    defaultValue={{ value: 'etc', label: '직접입력' }}
                    onChange={changeEmailOption} />
                </EmailField>
                <SignUpField
                type="text"
                onChange={(e) => {setName(e.target.value);}}
                value={name}
                placeholder='닉네임' />
                <SignUpField
                type="password"
                onChange={(e) => {setPassword(e.target.value);}}
                value={password}
                placeholder='비밀번호' />
                <SignUpField
                type="password"
                onChange={(e) => {setConfirmPwd(e.target.value);}}
                value={confirmPwd}
                placeholder='비밀번호 확인' />
                <SignUpSubmitBtn type='submit' value="회원가입" />
            </SignUpForm>
        </Container>
    );
}
export default SignUp;