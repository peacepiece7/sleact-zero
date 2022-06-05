import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import {
  Header,
  WorkspaceWrapper,
  Workspaces,
  RightMenu,
  ProfileImg,
  Channels,
  WorkspaceName,
  MenuScroll,
  Chats,
  LogOutButton,
  ProfileModal,
} from '@layouts/Workspace/style';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
const Menu = loadable(() => import('@components/Menu'));

type Props = {
  title?: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
};
const Workspace: React.FC<Props> = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: userData, error, mutate } = useSWR('/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, { withCredentials: true })
      .then(() => mutate('/api/users'))
      .catch((error) => console.log(error.response.data));
  }, []);

  useEffect(() => {
    if (document) {
      const cookie = document.cookie;
      console.log(cookie);
    } else {
      console.log('문서가 로드되지 않았습니다.');
    }
  });

  const onCloseUserProfile = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickUserProfile = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setShowUserMenu((prev: boolean) => !prev);
  }, []);

  if (!userData) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}

            <ProfileImg src={gravatar.url(userData.email, { s: '35', d: 'retro' })}></ProfileImg>
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces></Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Scroll</MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />}></Route>
            <Route path="/dm/:workspace" element={<DirectMessage />}></Route>
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
