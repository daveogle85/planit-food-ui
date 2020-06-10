import styled from '../styles/theme';
import { listItem } from '../styles/heights';
import { CssProps } from '../styles/types';
import css from '@emotion/css/macro';

const styledDish = (props: CssProps) => css`
  .delete-dish > button {
    height: 100%;
    width: 30px;
  }
`;

export const styledAddMeal = (AddMeal: React.ComponentType) => styled(AddMeal)`
  margin: ${props => props.theme.spacing.large};

  .title {
    font-weight: ${props => props.theme.font.weight.bold};
    font-size: ${props => props.theme.font.size.large};
  }

  label {
    padding-right: ${props => props.theme.spacing.small};
  }

  .meal {
    padding-bottom: ${props => props.theme.spacing.small};
    input {
      height: ${listItem};
    }
  }

  .dishes {
    padding-bottom: ${props => props.theme.spacing.small};
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
