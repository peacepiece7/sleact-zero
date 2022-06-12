import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import React, { useCallback, useRef } from 'react';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
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
  const { data: chatData, mutate } = useSWR(
    () => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`,
    fetcher,
  );
  const scrollbarRef = useRef(null);
  const onSubmitForm = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutate(chatData);
          })
          .catch((error) => console.error(error));
      }
      e.target.textContent = '';
    },
    [workspace, chat, id],
  );

  console.log('Chat : ', chat);
  // [...chatData].reverse()
  if (!userData || !myData) return null;

  const chatSections = makeSection(
    chatData
      ? []
          .concat(...chatData)
          .flat()
          .reverse()
      : [],
  );

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname}></img>
        <span>{userData.nickname}</span>
      </Header>
      <ChatList ref={scrollbarRef} chatData={chatSections}></ChatList>;
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  );
};

export default DirectMessage;
