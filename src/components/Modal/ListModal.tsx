import React from 'react';
import Modal from 'styled-react-modal';
import { ModalProps } from './ModalTypes';
import { styleModal } from './StyledModal';
import { EmotionProps } from '../../styles/types';
import Loading from '../Loading/Loading';

const PlanitFoodModal = <T extends {}>(props: ModalProps<T> & EmotionProps) => {
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
    >
      <Loading isLoading={isLoading}>
        <div>
          <div className="list">
            {listItems && listItems.map(item => listItem(item))}
          </div>
          <button onClick={closeModal}>Close me</button>
        </div>
      </Loading>
    </Modal>
  );
};

const StyledModal = styleModal(
  PlanitFoodModal as React.ComponentType
) as typeof PlanitFoodModal;

export default StyledModal;
