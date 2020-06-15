import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import LoadingSpinner from '../../components/Spinner/Spinner';
import useOutsideAlerter from '../../helpers/clickedOutside';
import useDebounce from '../../helpers/debounce';
import { nullOrEmptyString } from '../../helpers/string';
import { BorderInfoState } from '../../styles/border';
import {
  AutoCompleteInputBaseType,
  AutoCompleteInputProps,
  AutoCompleteInputApiType,
} from './AutoCompleteInputTypes';
import { styledAutoCompleteInput } from './StyledAutoCompleteInput';
import FeedbackElement from '../FeedbackInput/FeedbackElement';
import { FeedbackElementState } from '../FeedbackInput/FeedbackElementTypes';

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
    convertFromApiType,
  } = props;
  const ID_ATTRIBUTE = 'input-id';
  const defaultOption = ['No Option Found'];
  const [options, setOptions] = useState<Array<string | ApiT>>(defaultOption);

  const [text, setText] = useState<string>(currentValue.name ?? '');
  const [loading, setLoading] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [optionLocked, setOptionLocked] = useState(
    !nullOrEmptyString(currentValue.id)
  );
  const [dirty, setDirty] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(text, 250);
  useOutsideAlerter(ref, () => setDropdownIsOpen(false));

  useEffect(() => {
    if (currentValue.name !== debouncedSearchTerm) {
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
  }, [debouncedSearchTerm, getOptions, currentValue]);

  useEffect(() => {
    setText(currentValue.name ?? '');
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
      const localOption = convertFromApiType(option);
      updateCurrentValue(localOption);
    }
    setDropdownIsOpen(false);
  };

  const handleBlur = () => {
    if (!dropdownIsOpen) {
      // This only happens when we are not selecting from the list
      // So we clear the id
      updateCurrentValue({
        ...currentValue,
        id: undefined,
        name: debouncedSearchTerm,
      });
    }
  };

  const handleDirtyChange = (dirty: boolean) => onDirty && onDirty(dirty);

  const getBorderInfoState = (): FeedbackElementState => {
    if (nullOrEmptyString(debouncedSearchTerm)) {
      return {
        borderState: BorderInfoState.HIDDEN,
      };
    }

    if (!nullOrEmptyString(inputError)) {
      return {
        borderState: BorderInfoState.ERROR,
        message: inputError,
      };
    }

    return optionLocked
      ? {
          borderState: BorderInfoState.INFO,
          message: 'Option Selected',
        }
      : {
          borderState: BorderInfoState.WARN,
          message: 'Option will be added to Database',
        };
  };

  return (
    <div
      className={classNames('auto-complete-input', props.className)}
      ref={ref}
    >
      <FeedbackElement state={getBorderInfoState()}>
        <input
          type="text"
          placeholder={props.placeholder}
          value={text}
          disabled={props.disabled}
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
