import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import React, { useCallback, useRef } from 'react';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import { useParams } from 'react-router';
import useInput from '@hooks/useInput';
import axios from 'axios';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { IDM } from '@typings/db';

const PAGE_SIZE = 20;
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate,
    setSize,
  } = useSWRInfinite(
    (index: number) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20);

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
      setChat('');
    },
    [workspace, mutate, id, chatData, chat],
  );

  if (!userData || !myData) return null;

  console.log('chat data : ', chatData);
  const chatSections = makeSection(
    chatData
      ? ([] as IDM[])
          .concat(...chatData)
          .flat()
          .reverse()
      : [],
  );

  console.log('chat sections data 변경 유뮤 확인', chatSections);
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname}></img>
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        ref={scrollbarRef}
        chatSections={chatSections}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
        // scrollbarRef={undefined}
      ></ChatList>
      ;
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
        placeholder={`Message ${userData.nickname}`}
        data={[]}
      ></ChatBox>
    </Container>
  );
};

export default DirectMessage;
