import styled, { theme } from '../../styles/theme';
import css from '@emotion/css/macro';
import { input, pointer } from '../../styles/common';

export const styledEditMeal = (EditMeal: React.ComponentType) => styled(
  EditMeal
)`
  margin: ${props => props.theme.spacing.large};

  button {
    ${pointer}
  }

  .title {
    font-weight: ${props => props.theme.font.weight.bold};
    font-size: ${props => props.theme.font.size.large};
  }

  .edit-meal-name {
    ${input}
  }

  .clear-meal {
    margin-top: ${props => props.theme.spacing.small};
  }

  .save-changes {
    margin-right: ${props => props.theme.spacing.small};
  }

  label {
    padding-right: ${props => props.theme.spacing.small};
  }

  .meal {
    padding-bottom: ${props => props.theme.spacing.small};
  }

  button {
    padding-top: ${props => props.theme.spacing.xSmall};
    padding-bottom: ${props => props.theme.spacing.xSmall};
  }

  .options {
    padding-bottom: ${props => props.theme.spacing.medium};
  }

  textarea {
    width: 100%;
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
