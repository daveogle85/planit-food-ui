export type ModalProps<T> = {
  listItems: Array<T> | null;
  listItem: (item: T) => JSX.Element;
  isOpen: boolean;
  closeModal: () => void;
  onBeforeOpen: () => void;
  isLoading: boolean;
};
