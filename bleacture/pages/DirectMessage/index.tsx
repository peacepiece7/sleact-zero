import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import React, { useCallback } from 'react';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import useInput from '@hooks/useInput';
import axios from 'axios';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);

  const [chat, onChangeChat] = useInput('');
  const { data: chatData } = useSWR(() => `/api/workspace/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`);
  console.log('chat data :', chatData);
  const onSubmitForm = useCallback(
    (e: React.ChangeEvent<HTMLDListElement>) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspace/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            // mutate(`/api/workspace/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`);
          })
          .catch((error) => console.error(error));
      }
    },
    [workspace, chat, id],
  );

  if (!userData || !myData) return null;
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname}></img>
        <span>{userData.nickname}</span>
      </Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  );
};

export default DirectMessage;
