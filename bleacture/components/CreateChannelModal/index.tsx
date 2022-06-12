import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Label, Input, Button } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  children?: JSX.Element | JSX.Element[] | string | string[];
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: React.FC<Props> = ({ onCloseModal, show, setShowCreateChannelModal }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const [newChannel, onChangeNewChannel, setnewChannel] = useInput('');
  const { data: userData } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData, mutate } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  console.log(channelData?.length);
  const onCreateChannel = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          setShowCreateChannelModal(false);
          mutate();
          setnewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );

  if (!show) return null;
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
