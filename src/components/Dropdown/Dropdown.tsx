import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import useOutsideAlerter from '../../helpers/clickedOutside';
import { EmotionProps } from '../../styles/types';
import { DropdownProps } from './DropdownTypes';
import { styleDropdown } from './StyledDropdown';
import { useOutOfBounds } from '../../helpers/outOfBounds';

const useDropdown = (props: DropdownProps) => {
  const { label, defaultState = '', onSelect, options } = props;
  const Header =
    typeof label === 'string'
      ? () => <div className="dd-header-title">{label}</div>
      : label;
  const [selected, setSelected] = useState(defaultState);
  const [isOpen, setIsOpen] = useState(false);
  const handleItemClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const option: string = e.currentTarget.innerText;
    setSelected(option);
    if (onSelect && Object.keys(onSelect).some(k => k === option)) {
      onSelect[option]();
    }
    setIsOpen(false);
  };
  const Dropdownmaker = (props: EmotionProps) => {
    const dropdownRef = useRef(null);
    const [listRef, isOutOfBounds] = useOutOfBounds();
    useOutsideAlerter(dropdownRef, () => setIsOpen(false));
    return (
      <div
        className={classNames(['dd-wrapper', props.className])}
        ref={dropdownRef}
      >
        <div className="dd-header" onClick={() => setIsOpen(!isOpen)}>
          <Header />
        </div>
        <div>
          <ul
            className={classNames('dd-list', {
              'dd-open': isOpen,
              'dd-oob': isOutOfBounds,
            })}
            ref={listRef as any}
          >
            {options.map(o => (
              <li className="dd-list-item" onClick={handleItemClick} key={o}>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  return {
    selected,
    isOpen,
    component: styleDropdown(Dropdownmaker as React.ComponentType),
    setSelected,
    setIsOpen,
  };
};

export default useDropdown;
