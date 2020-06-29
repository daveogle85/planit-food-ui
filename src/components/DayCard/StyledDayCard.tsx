import css from '@emotion/css/macro';

import styled from '../../styles/theme';
import { CssProps } from '../../styles/types';

const header = css`
  header {
    text-align: center;
  }
`;

const main = (props: CssProps) => css`
  .dc-main {
    margin-left: ${props.theme.spacing.large};
  }

  .dc-notes {
    margin-top: ${props.theme.spacing.medium};
  }
`;

export const styleDayCard = (DayCard: React.ComponentType) =>
  styled(DayCard)`
    height: 100%;
    background-color: ${props => props.theme.colours.background.mealCardBlue};
    margin: 0 ${props => props.theme.spacing.small};
    border: ${props =>
      props.theme.border.thin(props.theme.colours.background.backgroundGrey)};
    border-radius: ${props => props.theme.border.radius.medium};
    ${header}
    ${main}
  `;
