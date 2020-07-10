import styled from '../../styles/theme';
import { fullScreen, pointer } from '../../styles/common';
import { listItem } from '../../styles/heights';

export const styleModal = (Modal: React.ComponentType) =>
  styled(Modal)`
  display: flex;
  flex-direction: column;
  ${fullScreen}
  background-color: ${props => props.theme.colours.white};
  margin: ${props => props.theme.spacing.xLarge};
  overflow-y: scroll;
  .list {
    margin: ${props => props.theme.spacing.large};

    > div {
      height: ${listItem};
      padding: ${props => props.theme.spacing.xSmall};
      display: flex;
      align-items: center;
      border-radius: ${props => props.theme.border.radius.medium};
    }

    > div:hover {
      ${pointer}
      background-color: ${props => props.theme.colours.background.hoverGrey};
    }
  }

  .close-button {
    margin: 0 ${props => props.theme.spacing.large};
    padding-bottom: ${props => props.theme.spacing.large};
  }

  button {
    ${pointer}
    margin-bottom: ${props => props.theme.spacing.large};
    width: 100%;
    height: 100%;
  }
  `;
