import styled from '../../styles/theme';

export const styleModal = (Modal: React.ComponentType) =>
  styled(Modal)`
    width: 20rem;
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colours.white};
  `;
