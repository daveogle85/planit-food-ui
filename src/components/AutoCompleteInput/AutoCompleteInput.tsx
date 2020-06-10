import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import LoadingSpinner from '../../components/Spinner/Spinner';
import useOutsideAlerter from '../../helpers/clickedOutside';
import useDebounce from '../../helpers/debounce';
import { nullOrEmptyString } from '../../helpers/string';
import FeedbackInput from '../FeedbackInput/FeedbackInput';
import { AutoCompleteInputProps } from './AutoCompleteInputTypes';
import { styledAutoCompleteInput } from './StyledAutoCompleteInput';
import { BorderInfoState } from '../../styles/border';

export function AutoCompleteInput<T extends { id: string; name?: string }>(
  props: AutoCompleteInputProps<T>
) {
  const { getOptions, onOptionSelect, initialValue } = props;
  const ID_ATTRIBUTE = 'input-id';
  const defaultOption = ['No Option Found'];
  const [options, setOptions] = useState<Array<string | T>>(defaultOption);
  const [text, setText] = useState<string>(initialValue ?? '');
  const [loading, setLoading] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [optionLocked, setOptionLocked] = useState(
    !nullOrEmptyString(initialValue)
  );
  const ref = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(text, 250);
  useOutsideAlerter(ref, () => setDropdownIsOpen(false));

  useEffect(() => {
    if (initialValue !== debouncedSearchTerm) {
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
  }, [debouncedSearchTerm, getOptions, initialValue]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.currentTarget.value;
    setDropdownIsOpen(newText !== '');
    setText(newText);
    setOptionLocked(false);
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const target = event.target as HTMLElement;
    const id = target.getAttribute(ID_ATTRIBUTE);
    const option = options.find(d => typeof d !== 'string' && d.id === id) as
      | T
      | undefined;
    if (option) {
      onOptionSelect(option);
      setOptionLocked(true);
    }
    setDropdownIsOpen(false);
  };

  return (
    <div
      className={classNames('auto-complete-input', props.className)}
      ref={ref}
    >
      <FeedbackInput
        type="text"
        placeholder={props.placeholder}
        value={text}
        onChange={handleTextChange}
        borderState={optionLocked ? BorderInfoState.INFO : BorderInfoState.WARN}
        hideBorder={nullOrEmptyString(debouncedSearchTerm)}
        message={
          optionLocked ? 'Option Selected' : 'Option will be added to Database'
        }
      />
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
