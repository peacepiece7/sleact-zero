import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import { Container, Header } from './styles';

import ChatBox from '@components/ChatBox';
import axios from 'axios';

const Channel = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat] = useInput('');

  // 에러를 막기 위한 임시 코드 입니다!
  const { data: chatData } = useSWR(() => `/api/workspace/${workspace}/dms/${id}/chats?perPage=${20}&page=${1}`);
  console.log('Channel :', chatData);
  const onSubmitForm = useCallback(
    (e: React.ChangeEvent<HTMLDListElement>) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
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

  return (
    <Container>
      <Header>Channel</Header>
      <ChatList chatData={chatData}></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  );
};

export default Channel;
