import styled from '../../styles/theme';

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
