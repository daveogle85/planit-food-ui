import { fullScreen, centerFlex } from '../../styles/common';
import styled from '../../styles/theme';
import { bounce } from '../../styles/keyframes';

export const styledLogin = (Login: React.ComponentType) => styled(Login)`
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

export const styledLoginButton = (LoginButton: React.ComponentType) => styled(
  LoginButton
)`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    outline: none;
  }

  cursor: pointer;
  position: relative;
  ${centerFlex}
  width: 130px;
  height: 30px;
  background-color: ${props => props.theme.colours.background.loginButton};
  border-radius: 7px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  &:before,
  &:after {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    width: 50%;
    height: 100%;
    transition: 0.25s linear;
    z-index: ${props => props.theme.zIndex.one};
  }
  &:before {
    content: '';
    left: 0;
    justify-content: flex-end;
    background-color: ${props => props.theme.colours.background.loginButton};
  }
  &:after {
    content: '';
    right: 0;
    justify-content: flex-start;
    background-color: ${props => props.theme.colours.background.loginButton};
  }
  &:hover {
    background-color: ${props =>
      props.theme.colours.background.loginButtonHover};
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    span {
      opacity: 0;
      z-index: -3;
    }
    &:before {
      opacity: 0.5;
      transform: translateY(-100%);
    }
    &:after {
      opacity: 0.5;
      transform: translateY(100%);
    }
  }
  span {
    position: absolute;
    top: 0;
    left: 0;
    ${centerFlex}
    width: 100%;
    height: 100%;
    color: ${props => props.theme.colours.background.whitesmoke};
    font-size: ${props => props.theme.font.size.small};
    font-weight: ${props => props.theme.font.weight.bold};
    opacity: 1;
    transition: opacity 0.25s;
    z-index: ${props => props.theme.zIndex.two};
  }
  .social-link {
    cursor: pointer;
    position: relative;
    ${centerFlex}
    width: 100%;
    height: 100%;
    color: ${props => props.theme.colours.background.whitesmoke};
    text-decoration: none;
    transition: 0.25s;
    svg {
      width: 20%;
      height: 100%;
      transform: scale(1);
    }
    &:hover {
      background-color: rgba(
        ${props => props.theme.colours.background.whitesmoke},
        0.1
      );
      animation: ${bounce} 0.4s linear;
    }
  }
`;
