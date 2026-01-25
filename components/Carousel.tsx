"use client"

import React, { useState } from 'react';
import styles from './Carousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
  cardWidth?: number;
}

export function Carousel({ children, cardWidth = 300 }: CarouselProps) {
  const [rotateInt, setRotateInt] = useState(0);
  const size = React.Children.count(children);
  
  // --- MATH ADJUSTMENT ---
  // Increased multiplier from 1.7 to 2.5 to widen the cylinder
  // This stops the front cards from overlapping
  const translateZ = Math.round((cardWidth / 2) / Math.tan(Math.PI / size)) * 2.5;
  
  const ry = 360 / size;

  const handlePrev = () => setRotateInt(prev => prev + 1);
  const handleNext = () => setRotateInt(prev => prev - 1);

  return (
    <div className={styles.scene}>
      {/* Buttons are now direct children of Scene, pushed to edges */}
      <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
        <ChevronLeft size={24} />
      </button>
      
      <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
        <ChevronRight size={24} />
      </button>

      <div 
        className={styles.carouselWrapper}
        style={{
          width: cardWidth,
          transform: `rotateY(0deg) translateZ(${-translateZ}px)`
        }}
      >
        {React.Children.map(children, (child, i) => {
          const z = (rotateInt * ry) + (i * ry);
          const zz = z % 360;
          
          // Logic to find Front/Clockwise/CounterClockwise
          const isFront = zz === 0;
          
          // Using a small epsilon (0.1) for float comparison safety
          const isClockwise = (Math.abs(zz - ry) < 0.1) || (Math.abs(zz - (-360 + ry)) < 0.1);
          const isCounterClockwise = (Math.abs(zz - (360 - ry)) < 0.1) || (Math.abs(zz - (-ry)) < 0.1);

          let className = styles.cardWrapper;
          let clickHandler = undefined;

          if (isFront) {
            className += ` ${styles.front}`;
          } else if (isClockwise) {
            className += ` ${styles.clickable}`;
            clickHandler = handleNext;
          } else if (isCounterClockwise) {
            className += ` ${styles.clickable}`;
            clickHandler = handlePrev;
          }

          return (
            <div
              className={className}
              onClick={clickHandler}
              style={{
                // The exact CodePen transform logic
                transform: `rotateY(${z}deg) translateZ(${translateZ}px) rotateY(${-z}deg)`
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}