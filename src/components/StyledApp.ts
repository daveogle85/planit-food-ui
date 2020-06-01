import styled from '../styles/theme';
import { fullScreenRelative } from '../styles/common';
import { navBar } from '../styles/heights';

export const styledApp = (App: React.ComponentType) => styled(App)`
  ${fullScreenRelative(navBar)}
`;
