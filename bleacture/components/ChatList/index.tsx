import React, { useCallback, forwardRef } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  // scrollbarRef: RefObject<Scrollbars>;
  isReachingEnd?: boolean;
  isEmpty: boolean;
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
}
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, isReachingEnd, setSize, isEmpty }, ref) => {
  const onScroll = useCallback((values: any) => {
    console.log('isReachingEnd', isReachingEnd, 'isEmpty', isEmpty);
    if (values.scrollTop === 0) {
      console.log('가장 위');
      setSize((prev) => {
        console.log('SET SIZE PREV :', prev);
        return prev + 1;
      }).then(() => {
        // 스크롤 위치 유지
      });
    }
  }, []);

  if (!chatSections) return null;
  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
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
