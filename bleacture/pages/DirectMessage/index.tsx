import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import React, { useCallback, useEffect, useRef } from 'react';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import { useParams } from 'react-router';
import useInput from '@hooks/useInput';
import axios from 'axios';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { IDM } from '@typings/db';
import Scrollbars from 'react-custom-scrollbars-2';

const PAGE_SIZE = 20;
const DirectMessage = () => {
  const scrollbarRef = useRef<Scrollbars>(null);
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

  let isEmpty = chatData?.[0]?.length === 0;
  let isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) ? true : false;

  const onSubmitForm = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      e.preventDefault();
      // Optimistic UI
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutate((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          mutate(chatData);
          setChat('');
          if (scrollbarRef.current) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id, myData, userData, chatData, mutate, setChat],
  );

  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!userData || !myData) return null;

  const chatSections = makeSection(
    chatData
      ? ([] as IDM[])
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
      <ChatList
        ref={scrollbarRef}
        chatSections={chatSections}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
        // scrollbarRef={undefined}
      ></ChatList>
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
