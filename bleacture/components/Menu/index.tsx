import React, { useCallback } from 'react';
import { CreateMenu, CloseModalButton } from '@components/Menu/styles';

interface Props {
  show: boolean;
  onCloseModal: (e: any) => void;
  style: React.CSSProperties;
  closeButton?: boolean;
  children?: JSX.Element | JSX.Element[] | string | string[];
}

const Menu: React.FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const onStopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);
  if (!show) return null;
  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={onStopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal} />}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
