import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setCookie } from 'api';
import queryString from 'query-string';

const SetToken: React.FC = () => {
  const { search } = useLocation();

  useEffect(() => {
    const { token } = queryString.parse(search);
    setCookie('token', token as string);
    window.close();
  }, []);

  return (
    <div>
      <span>로그인 중..</span>
    </div>
  );
}

export default SetToken;