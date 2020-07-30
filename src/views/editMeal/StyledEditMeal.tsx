import styled from '../../styles/theme';
import { input } from '../../styles/common';

export const styledEditMeal = (EditMeal: React.ComponentType) => styled(
  EditMeal
)`
  .edit-meal-name {
    ${input}
  }

  .options {
    padding-bottom: ${props => props.theme.spacing.medium};
  }

  textarea {
    resize: vertical;
    width: 100%;
  }
`;
