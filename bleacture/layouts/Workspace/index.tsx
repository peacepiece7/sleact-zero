import React, { useCallback, useEffect, useState } from 'react';
import useSWR, { MutatorCallback } from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import { toast } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { Navigate, Link } from 'react-router-dom';
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
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from '@layouts/Workspace/style';
import { IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
const Menu = loadable(() => import('@components/Menu'));
const Modal = loadable(() => import('@components/Modal'));
const CreateChannelModal = loadable(() => import('@components/CreateChannelModal'));
const InviteWorkspaceModal = loadable(() => import('@components/InvaiteWorkspaceModal'));
const InviteChannelModal = loadable(() => import('@components/InvaiteChannelModal'));

type Props = {
  title?: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
};

const Workspace: React.FC<Props> = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModdal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkpsace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const { data: userData, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 3000,
  });
  const { data: channelData } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const onLogOut = useCallback(() => {
    axios
      .post('/api/users/logout', null, { withCredentials: true })
      .then(() => mutate('/api/users'))
      .catch((error) => console.log(error.response.data));
  }, []);

  const onCloseUserProfile = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickUserProfile = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setShowUserMenu((prev: boolean) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModdal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      if (!newWorkspace) return;
      axios
        .post('/api/workspaces', {
          workspace: newWorkspace,
          url: newUrl,
        })
        .then(() => {
          mutate('/api/workspaces');
          setShowCreateWorkspaceModdal(false);
          setNewWorkpsace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          // 에러메시지가 토스트 처럼 튀어나옴 = toast
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModdal(false);
    setShowCreateChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);
  const onClickInvaiteWorkspace = useCallback(() => {}, []);

  if (!userData) return <Navigate replace to="/login" />;
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.email} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </Menu>
            )}
            <ProfileImg src={gravatar.url(userData.email, { s: '35', d: 'retro' })}></ProfileImg>
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws: any) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogOut}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((v: any) => {
              return <div key={v.id}>{v.name}</div>;
            })}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />}></Route>
            <Route path="/dm/:workspace" element={<DirectMessage />}></Route>
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}></Input>
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      ></CreateChannelModal>
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      ></InviteWorkspaceModal>
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      ></InviteChannelModal>
    </div>
  );
};

export default Workspace;
