import classNames from 'classnames';
import React from 'react';

import { EmotionProps } from '../../styles/types';
import NavBar from '../NavBar/NavBar';
import { stylePage } from './StyledPage';

const Page: React.FC<EmotionProps> = props => {
  return (
    <div className={classNames(props.className, 'planit-food-pg')}>
      <NavBar />
      {props.children}
    </div>
  );
};

const StyledPage = stylePage(Page as React.ComponentType) as typeof Page;

export default StyledPage;
