import { fullScreen } from '../../styles/common';
import styled from '../../styles/theme';
import Login from './Login';

export default styled(Login)`
  background-color: ${props => props.theme.colours.background.backgroundGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  ${fullScreen}
  .login-window {
    background-color: ${props =>
      props.theme.colours.background.backgroundWhite};
    border-radius: ${props => props.theme.border.radius.medium};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 500px;

    .text {
      margin-bottom: ${props => props.theme.spacing.large};
    }
  }
`;
