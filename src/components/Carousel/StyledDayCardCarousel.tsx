import styled from '../../styles/theme';
import { fullScreen } from '../../styles/common';

export const styleDayCardCarousel = (DayCardCarousel: React.ComponentType) =>
  styled(DayCardCarousel)`
  ${fullScreen}
    margin: ${props => props.theme.spacing.medium};
    border-radius: ${props => props.theme.border.radius.medium};
    
    .react-multi-carousel-track {
        height: 100%;
    } 
    .react-multi-carousel-item {
        height: 90%;
    }

    .react-multiple-carousel__arrow {
        bottom: 0;
    }

    .react-multiple-carousel__arrow--right {
        right: 0;
    }

    .react-multiple-carousel__arrow--left {
        left: 0;
    }
  `;
