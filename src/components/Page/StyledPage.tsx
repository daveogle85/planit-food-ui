import styled from '../../styles/theme';
import { fullScreen } from '../../styles/common';
import { navBar } from '../../styles/heights';

export const stylePage = (Page: React.ComponentType) => styled(Page)`
    ${fullScreen}
    top: ${navBar};
`;
