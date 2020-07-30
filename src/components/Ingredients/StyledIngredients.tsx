import styled from '../../styles/theme';
import { CssProps } from '../../styles/types';
import css from '@emotion/css/macro';
import { listItem } from '../../styles/heights';

const styleIngredient = (props: CssProps) => css`
  .delete-ingredient > button {
    height: 100%;
    width: 30px;
  }
`;

export const styleIngredients = (Ingredients: React.ComponentType) => styled(
  Ingredients
)`
  .ingredients {
    padding: ${props => props.theme.spacing.small};
  }

  & .feedback-icon {
    &:after {
      right: -25px;
    }
  }

  .ingredients,
  & {
    width: 100%;
  }

  .quantity > input {
    padding-left: ${props => props.theme.spacing.xxSmall};
    width: 50px;
    height: 26px;
    border: ${props =>
      props.theme.border.thin(props.theme.colours.background.backgroundGrey)};
    border-radius: ${props => props.theme.border.radius.medium};
  }

  .unit-type {
    width: 70px;
    height: 30px;
    border: ${props =>
      props.theme.border.thin(props.theme.colours.background.backgroundGrey)};
    border-radius: ${props => props.theme.border.radius.medium};
  }

  .ingredients-grid {
    display: grid;
    grid-template-columns: 4fr 1fr 1fr 1fr;
    grid-auto-rows: ${listItem};
    grid-gap: ${props => props.theme.spacing.small};
    margin-bottom: ${props => props.theme.spacing.medium};
    padding-bottom: ${props => props.theme.spacing.small};
    ${styleIngredient}
  }
`;
