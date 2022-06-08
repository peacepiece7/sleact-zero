import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { Container, Header } from './styles';

import ChatBox from '@components/ChatBox';
import axios from 'axios';
import useSWR from 'swr';

const Channel = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat] = useInput('');
  const { data: chatData, mutate } = useSWR(
    () => `/api/workspace/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`,
  );
  console.log(chatData);
  const onSubmitForm = useCallback(
    (e: React.ChangeEvent<HTMLDListElement>) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspace/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutate(`/api/workspace/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`);
          })
          .catch((error) => console.error(error));
      }
    },
    [workspace, chat, id, mutate],
  );

  return (
    <Container>
      <Header>Channel</Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  );
};

export default Channel;
