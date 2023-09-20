import React, { useState } from 'react';
import c1 from './AdminSite/assets/img/Carousel1.jpg'
import c2 from './AdminSite/assets/img/Carousel2.jpg'
import c3 from './AdminSite/assets/img/Carousel3.jpg'
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  
} from 'reactstrap';

const items = [
  {
    src: c1,
  },
  {
    src: c2,
  },
  {
    src: c3,
  }
];

const CarouselComponents = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} style={{width:"80%"}}/>
        
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

export default CarouselComponents;