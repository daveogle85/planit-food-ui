import classNames from 'classnames';
import React from 'react';
import Modal from 'styled-react-modal';

import { EmotionProps } from '../../styles/types';
import Loading from '../Loading/Loading';
import { ModalProps } from './ModalTypes';
import { styleModal } from './StyledModal';

const ListModal = <T extends {}>(props: ModalProps<T> & EmotionProps) => {
  const {
    isOpen,
    closeModal,
    onBeforeOpen,
    isLoading,
    listItems,
    listItem,
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      beforeOpen={onBeforeOpen}
      onEscapeKeydown={closeModal}
      allowScroll={true}
    >
      <Loading isLoading={isLoading}>
        <div className={classNames(props.className, 'sm-body')}>
          <div className="list">
            {listItems && listItems.map(item => listItem(item))}
          </div>
          <div className="close-button">
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      </Loading>
    </Modal>
  );
};

const StyledListModal = styleModal(
  ListModal as React.ComponentType
) as typeof ListModal;

export default StyledListModal;
