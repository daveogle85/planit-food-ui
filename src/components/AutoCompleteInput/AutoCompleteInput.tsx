import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import ListModal from '../../components/Modal/ListModal';
import LoadingSpinner from '../../components/Spinner/Spinner';
import { ErrorState, FeedbackStatus } from '../../ducks/toast/ToastTypes';
import useOutsideAlerter from '../../helpers/clickedOutside';
import useDebounce from '../../helpers/debounce';
import { nullOrEmptyString } from '../../helpers/string';
import FeedbackElement from '../FeedbackInput/FeedbackElement';
import {
  AutoCompleteInputApiType,
  AutoCompleteInputBaseType,
  AutoCompleteInputProps,
} from './AutoCompleteInputTypes';
import { styledAutoCompleteInput } from './StyledAutoCompleteInput';
import { isNullOrUndefined } from 'util';
import EyeIcon from '../../images/eye';
import { colours } from '../../styles/colours';
import css from '@emotion/css/macro';

export function AutoCompleteInput<
  T extends AutoCompleteInputBaseType,
  ApiT extends AutoCompleteInputApiType
>(props: AutoCompleteInputProps<T, ApiT>) {
  const {
    getOptions,
    updateCurrentValue,
    currentValue,
    onDirty,
    inputError,
    allItems,
    allItemsLoading,
    fetchAll,
    disabled,
    allowUserDefinedInput,
  } = props;
  const ID_ATTRIBUTE = 'input-id';
  const defaultOption = ['No Option Found'];
  const [options, setOptions] = useState<Array<string | ApiT>>(defaultOption);

  const [text, setText] = useState<string>(currentValue?.name ?? '');
  const [loading, setLoading] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [optionLocked, setOptionLocked] = useState(
    !nullOrEmptyString(currentValue?.id)
  );
  const [dirty, setDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(text, 250);
  useOutsideAlerter(ref, () => setDropdownIsOpen(false));

  useEffect(() => {
    if (currentValue?.name !== debouncedSearchTerm && dropdownIsOpen) {
      const fetchOptions = async () => {
        setLoading(true);
        const options = nullOrEmptyString(debouncedSearchTerm)
          ? []
          : await getOptions(debouncedSearchTerm);
        setLoading(false);
        setOptions(options.length ? options : ['No Option Found']);
      };
      fetchOptions();
    }
  }, [debouncedSearchTerm, getOptions, currentValue, dropdownIsOpen]);

  useEffect(() => {
    setText(currentValue?.name ?? '');
  }, [currentValue]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.currentTarget.value;
    setDropdownIsOpen(newText !== '');
    setText(newText);
    const newDirty = !nullOrEmptyString(newText);
    if (newDirty !== dirty) {
      handleDirtyChange(newDirty);
      setDirty(newDirty);
    }

    if (optionLocked) {
      setOptionLocked(false);
    }
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const target = event.target as HTMLElement;
    const id = target.getAttribute(ID_ATTRIBUTE);
    const option = options.find(d => typeof d !== 'string' && d.id === id) as
      | ApiT
      | undefined;
    const newText = option?.name ?? text;
    setText(newText);
    if (option) {
      setOptionLocked(true);
      updateCurrentValue(option);
    }
    setDropdownIsOpen(false);
  };

  const handleBlur = () => {
    if (optionLocked) {
      updateCurrentValue(null);
    } else if (!dropdownIsOpen) {
      // This only happens when we are not selecting from the list
      // So we clear the id
      currentValue == null
        ? updateCurrentValue({ name: debouncedSearchTerm } as ApiT)
        : updateCurrentValue({
            ...currentValue,
            id: undefined,
            name: debouncedSearchTerm,
          });
    }
  };

  const handleDirtyChange = (dirty: boolean) => onDirty && onDirty(dirty);

  const getInfoState = (): ErrorState => {
    if (nullOrEmptyString(debouncedSearchTerm)) {
      return {
        status: FeedbackStatus.HIDDEN,
      };
    }

    if (!nullOrEmptyString(inputError)) {
      return {
        status: FeedbackStatus.ERROR,
        message: inputError,
      };
    }

    if (optionLocked) {
      return {
        status: FeedbackStatus.INFO,
        message: 'Option Selected',
      };
    }

    return allowUserDefinedInput
      ? {
          status: FeedbackStatus.WARN,
          message: 'Option will be added to Database',
        }
      : {
          status: FeedbackStatus.ERROR,
          message: 'Option must be selected from list',
        };
  };

  const setModalOpen = () => setIsModalOpen(true);
  const setModalClose = () => setIsModalOpen(false);

  const handleRequestAllItems = () => {
    if (isNullOrUndefined(allItems)) {
      fetchAll();
    }
  };

  const handleMealSelectedFromModalList = (item: T) => () => {
    setText(item.name ?? text);
    setOptionLocked(true);
    updateCurrentValue(item);
    setModalClose();
  };

  const modalListItem = (item: T) => (
    <div key={item.id} onClick={handleMealSelectedFromModalList(item)}>
      {item.name}
    </div>
  );

  const inputPadding = disabled
    ? css`
        input {
          padding-left: 4px;
        }
      `
    : undefined;

  return (
    <div
      className={classNames('auto-complete-input', props.className)}
      ref={ref}
    >
      {!disabled && (
        <div className="view-all" title="View All Meals" onClick={setModalOpen}>
          <EyeIcon fill={colours.eyeIconBlue} />
        </div>
      )}
      <ListModal
        isOpen={isModalOpen}
        closeModal={setModalClose}
        listItems={allItems}
        isLoading={allItemsLoading}
        onBeforeOpen={handleRequestAllItems}
        listItem={modalListItem}
      />
      <FeedbackElement state={getInfoState()} styles={inputPadding}>
        <input
          type="text"
          placeholder={props.placeholder}
          value={text}
          disabled={disabled}
          onChange={handleTextChange}
          onBlur={handleBlur}
        />
      </FeedbackElement>
      <ul className={classNames('dd-list', { 'dd-open': dropdownIsOpen })}>
        {loading ? (
          <li key="loading">
            <LoadingSpinner />
          </li>
        ) : (
          options.map(option => {
            if (typeof option === 'string') {
              return <li key={option}>{option}</li>;
            }
            return (
              <li
                key={option.id}
                input-id={option.id}
                onClick={handleItemClick}
              >
                {option.name}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default styledAutoCompleteInput(
  AutoCompleteInput as React.FC
) as typeof AutoCompleteInput;
