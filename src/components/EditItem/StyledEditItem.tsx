import styled, { theme } from '../../styles/theme';
import css from '@emotion/css/macro';
import { pointer } from '../../styles/common';

export const styledEditItem = (EditItem: React.ComponentType) => styled(
  EditItem
)`
  margin: ${props => props.theme.spacing.large};

  button {
    ${pointer}
  }

  .title {
    font-weight: ${props => props.theme.font.weight.bold};
    font-size: ${props => props.theme.font.size.large};
  }

  .clear-button {
    margin-top: ${props => props.theme.spacing.small};
  }

  .save-changes {
    margin-right: ${props => props.theme.spacing.small};
  }

  label {
    padding-right: ${props => props.theme.spacing.small};
  }

  button {
    padding-top: ${props => props.theme.spacing.xSmall};
    padding-bottom: ${props => props.theme.spacing.xSmall};
  }
`;

export const editBoxStyle = css`
  &,
  .edit-box {
    width: 100%;
  }

  .edit-box {
    padding: ${theme.spacing.small};
  }

  .feedback-icon {
    top: 5px;
  }

  .feedback-icon:hover:after {
    right: -15px;
    bottom: 130%;
  }
`;
