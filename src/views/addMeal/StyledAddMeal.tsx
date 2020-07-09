import styled from '../../styles/theme';
import { listItem } from '../../styles/heights';
import { CssProps } from '../../styles/types';
import css from '@emotion/css/macro';
import { pointer } from '../../styles/common';

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
  }

  .meal-label {
    display: flex;
    align-items: center;
    > div,
    svg {
      ${pointer}
      height: 17px;
      width: 17px;
    }
  }

  .dishes {
    padding: ${props => props.theme.spacing.small};
  }

  .dishes-wrapper .feedback-icon {
    top: ${props => props.theme.spacing.small};

    &:after {
      right: -25px;
    }
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

  .dishes,
  .dishes-wrapper {
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
