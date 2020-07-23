import styled from '../../styles/theme';
import { CssProps } from '../../styles/types';
import css from '@emotion/css/macro';
import { listItem } from '../../styles/heights';

const styledDish = (props: CssProps) => css`
  .delete-dish > button {
    height: 100%;
    width: 30px;
  }
`;

export const styleIngredients = (Ingredients: React.ComponentType) => styled(
  Ingredients
)`
  .dishes {
    padding: ${props => props.theme.spacing.small};
  }

  & .feedback-icon {
    top: ${props => props.theme.spacing.small};

    &:after {
      right: -25px;
    }
  }

  .dishes,
  & {
    width: 100%;
  }

  .dishes-grid {
    display: grid;
    grid-template-columns: 4fr 1fr 1fr;
    grid-auto-rows: ${listItem};
    grid-gap: ${props => props.theme.spacing.small};
    margin-bottom: ${props => props.theme.spacing.medium};
    padding-bottom: ${props => props.theme.spacing.small};
    ${styledDish}
  }
`;
