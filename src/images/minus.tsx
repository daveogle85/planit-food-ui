import React from 'react';
import { EmotionProps } from '../styles/types';

const Minus = (
  props: EmotionProps & {
    colour?: string;
  }
) => {
  return (
    <svg
      version="1.1"
      id="minus"
      x="0px"
      y="0px"
      fill={props.colour ? props.colour : undefined}
      viewBox="0 0 83 83"
      enableBackground={'new 0 0 83 83'}
      xmlSpace={'preserve'}
    >
      <g>
        <path
          d="M81,36.166H2c-1.104,0-2,0.896-2,2v6.668c0,1.104,0.896,2,2,2h79c1.104,0,2-0.896,2-2v-6.668
		C83,37.062,82.104,36.166,81,36.166z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
};

export default Minus;
