import io from 'socket.io-client';
import { useCallback } from 'react';
// import axios from 'axios';

const sockets: { [key: string]: any } = {};

const backUrl = 'http://localhost:3095';

// namespace, room (workspace(slack) = namespace(socket), channel(slack) = namespace(socket)
const useSocket = (workspace?: string): [any | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'], // 폴링하지않고 바로 websocket을 씀 (폴링 : socket연결 전 http요청을 보내는 행위)
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;

// const sockets = io.connect(`${backUrl}/ws-${workspace}}`);
// socket.emit('hello', 'world');
// socket.on('message', (data: string) => {
//   console.log(data);
// });
// socket.on('onlineList', (data: []) => {
//   console.log(data);
// });
// socket.disconnect();
