import React, { useCallback, useRef } from 'react';
import { ChatZone } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars-2';
interface Prop {
  chatData: { [key: string]: IDM[] };
}

const ChatList: React.FC<Prop> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {typeof chatData !== 'string' && chatData
          ? chatData.map((chat) => {
              return <Chat key={chat.id} data={chat}></Chat>;
            })
          : null}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
