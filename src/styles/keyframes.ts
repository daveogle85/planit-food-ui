import { keyframes } from "@emotion/core";
import { theme } from "./theme";

export const bounce = keyframes`
    40% { transform: scale(1.4); }
    60% { transform: scale(0.8); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1.0); }
`;

export const ellipsis1 = keyframes`
    0% { transform: scale(0); }
    100% { transform: scale(1); }
    `;

export const ellipsis2 = keyframes`
        0% { transform: translate(0, 0); }
        100% { transform: translate(24px, 0); }
      `;

export const ellipsis3 = keyframes`
    0% { transform: scale(1); }
    100% { transform: scale(0); }
    `;

export const fadeIn = keyframes`
  from {bottom: 0; opacity: 0;}
  to {bottom: ${theme.spacing.medium}; opacity: 1;}
`;

export const fadeOut = keyframes`
  from {bottom: ${theme.spacing.medium}; opacity: 1;}
  to {bottom: 0; opacity: 0;}
`;
