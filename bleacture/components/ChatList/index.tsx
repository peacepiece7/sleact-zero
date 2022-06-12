import React, { useCallback, forwardRef } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars-2';
interface Props {
  chatData: { [key: string]: IDM[] };
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatData }, scrollRef) => {
  const onScroll = useCallback(() => {}, []);

  if (!chatData) return null;
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatData).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => {
                return <Chat key={chat.id} data={chat}></Chat>;
              })}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
