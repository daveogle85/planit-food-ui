import React from 'react';
import Carousel from 'react-multi-carousel';

import DayCardCarouselProps from './DayCardCarouselTypes';

import 'react-multi-carousel/lib/styles.css';
import DayCard from '../DayCard/DayCard';
import { breakpoints } from '../../styles/theme';
import { styleDayCardCarousel } from './StyledDayCardCarousel';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: breakpoints.desktop },
    items: 5,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: breakpoints.desktop, min: breakpoints.largeMobile },
    items: 3,
  },
  mobile: {
    breakpoint: { max: breakpoints.largeMobile, min: 0 },
    items: 1,
  },
};

const DayCardCarousel: React.FC<DayCardCarouselProps> = (
  props: DayCardCarouselProps
) => (
  <Carousel
    className={props.className}
    swipeable={true}
    draggable={true}
    showDots={true}
    centerMode={false}
    responsive={responsive}
    ssr={false} // means to render carousel on server-side.
    infinite={true}
    autoPlaySpeed={1000}
    keyBoardControl={true}
    customTransition="all .5"
    transitionDuration={500}
    containerClass="carousel-container"
    removeArrowOnDeviceType={['tablet', 'mobile']}
    dotListClass="custom-dot-list-style"
    itemClass="carousel-item"
  >
    {props.days.map(day => (
      <DayCard key={day.date.toString()} date={day.date} />
    ))}
  </Carousel>
);

const StyledDayCardCarousel = styleDayCardCarousel(
  DayCardCarousel as React.ComponentType
) as typeof DayCardCarousel;

export default StyledDayCardCarousel;
