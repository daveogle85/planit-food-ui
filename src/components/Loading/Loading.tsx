import React from 'react';
import { EmotionProps } from '../../styles/types';
import LoadingSpinner from '../Spinner/Spinner';

const Loading: React.FC<EmotionProps & { isLoading: boolean }> = props => {
  return <>{props.isLoading ? <LoadingSpinner /> : props.children}</>;
};

export default Loading;
