import styled from '../../styles/theme';
import css from '@emotion/css/macro';
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
`;

export const styleDayCard = (DayCard: React.ComponentType) =>
  styled(DayCard)`
    height: 100%;
    background-color: ${props => props.theme.colours.background.mealCardBlue};
    margin: 0 ${props => props.theme.spacing.small};
    border: ${props => props.theme.border.thin};
    border-radius: ${props => props.theme.border.radius.medium};
    ${header}
    ${main}
  `;