import React from 'react';
import { ChatZone } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';

interface Prop {
  chatData: IDM[];
}

const ChatList: React.FC<Prop> = ({ chatData }) => {
  return (
    <ChatZone>
      {chatData?.map((chat) => {
        return <Chat key={chat.id} data={chat}></Chat>;
      })}
    </ChatZone>
  );
};

export default ChatList;
