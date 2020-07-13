import React from 'react';
import { EmotionProps } from '../styles/types';

const EyeIcon = (props: EmotionProps & { fill?: string }) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
      fill={props.fill ? props.fill : undefined}
    >
      <g>
        <path
          d="M63,30.1C52.9,18.2,42.2,12,32,12c-10.2,0-20.9,6.2-31,18.1c-1,1.1-1,2.8,0,3.9C11.1,45.8,21.8,52,32,52
		c10.2,0,20.9-6.2,31-18.1C63.9,32.8,63.9,31.2,63,30.1z M32,48c-8.7,0-18.4-5.7-27.4-16c9-10.3,18.7-16,27.4-16
		c8.7,0,18.4,5.7,27.4,16C50.4,42.3,40.7,48,32,48z"
        />
        <path
          d="M32,20c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S38.6,20,32,20z M32,40c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8
		S36.4,40,32,40z"
        />
      </g>
    </svg>
  );
};

export default EyeIcon;
