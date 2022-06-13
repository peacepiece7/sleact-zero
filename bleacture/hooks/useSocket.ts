import io from 'socket.io-client';
import { useCallback } from 'react';
import { Socket } from 'webpack-dev-server';

const backUrl = 'http://localhost:3095';

const sockets: { [key: string]: any } = {};
// namespace, room (workspace(slack) = namespconst sockets: { [key: string]: any } = {};ace(socket), channel(slack) = namespace(socket)
const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
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
    console.info('create socket', workspace, sockets[workspace]);
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
