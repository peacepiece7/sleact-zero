import React, { useMemo } from 'react';
import { IDM } from '@typings/db';
import { ChatWrapper } from '@components/Chat/style';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexfiyString from 'regexify-string';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {
  data: IDM;
}

const Chat: React.FC<Props> = ({ data }) => {
  const user = data.Sender;
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const result = useMemo(
    () =>
      regexfiyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname}></img>
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
