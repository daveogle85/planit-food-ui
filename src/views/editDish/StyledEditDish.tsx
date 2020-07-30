import styled from '../../styles/theme';
import { input } from '../../styles/common';

export const styledEditDish = (EditDish: React.ComponentType) =>
  styled(EditDish)`
    .edit-dish-name {
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
