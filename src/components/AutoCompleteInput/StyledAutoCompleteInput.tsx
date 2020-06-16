import { listItem } from '../../styles/heights';
import styled from '../../styles/theme';
import { dropdownList } from '../Dropdown/StyledDropdown';

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
  }
  .feedback-hidden > input {
    border: ${props =>
      props.theme.border.thin(props.theme.colours.background.hoverGrey)};
    border-radius: ${props => props.theme.border.radius.medium};
    height: calc(100% - 6px); // account for border
  }

  & > div {
    width: 100%;
  }

  .dd-list {
    margin: 0;
    top: ${listItem};
    li:hover {
      background-color: ${props =>
        props.theme.colours.background.loginButtonHover};
    }
  }
`;
