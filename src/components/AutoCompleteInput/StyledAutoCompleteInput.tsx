import styled from '../../styles/theme';
import { dropdownList } from '../Dropdown/StyledDropdown';
import { listItem } from '../../styles/heights';
import { SerializedStyles } from '@emotion/core';

export const styledAutoCompleteInput = (
  AutoCompleteInput: React.ComponentType,
  extraStyles?: SerializedStyles
) => styled(AutoCompleteInput)`
  ${extraStyles}
  ${dropdownList}
  display: flex;
  position: relative;
  max-width: 500px;
  input {
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
