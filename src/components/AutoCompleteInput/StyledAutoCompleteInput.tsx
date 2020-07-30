import { listItem } from '../../styles/heights';
import styled from '../../styles/theme';
import { dropdownList } from '../Dropdown/StyledDropdown';
import { pointer, centerFlex } from '../../styles/common';

export const styledAutoCompleteInput = (
  AutoCompleteInput: React.ComponentType
) => styled(AutoCompleteInput)`
  ${dropdownList}
  display: flex;
  position: relative;
  max-width: 500px;
  height: ${listItem};
  input {
    width: 100%;
    height: 100%;
    padding-left: 32px;
  }
  
  .feedback-hidden > input {
    border: ${props =>
      props.theme.border.thin(props.theme.colours.background.hoverGrey)};
    border-radius: ${props => props.theme.border.radius.medium};
    height: calc(100% - 6px); // account for border
  }

  .view-all {
    position: absolute;
    top: 0;
    bottom: 0;
    ${centerFlex}
    padding: ${props => props.theme.spacing.xxSmall};
    width: 30px;
    svg {
      height: 28px;
      width: 28px;
    }
    ${pointer}
    z-index: ${props => props.theme.zIndex.one};
  }

  & > div {
    width: 100%;
  }

  .dd-list {
    margin: 0;
    z-index: ${props => props.theme.zIndex.two};
    top: ${listItem};
    li:hover {
      background-color: ${props =>
        props.theme.colours.background.loginButtonHover};
    }
  }
`;
