import React, { useCallback, forwardRef, MutableRefObject } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  isReachingEnd: boolean;
  isEmpty: boolean;
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
}
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, isReachingEnd, setSize, isEmpty }, ref) => {
  const onScroll = useCallback(
    (values: any) => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize((prev) => {
          return prev + 1;
        }).then(() => {
          const current = (ref as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [isReachingEnd, isEmpty, setSize, ref],
  );

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
