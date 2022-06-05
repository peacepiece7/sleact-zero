import React, { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

type Props = {
  title?: string;
  children: JSX.Element | JSX.Element[] | string | string[];
};
const Workspace: React.FC<Props> = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, { withCredentials: true })
      .then(() => mutate('/api/users'))
      .catch((error) => console.log(error.response.data));
  }, []);

  if (!data) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그이웃</button>
      {children}
    </div>
  );
};

export default Workspace;
