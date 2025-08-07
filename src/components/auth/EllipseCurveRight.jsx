import React from 'react';

const ellipses = [
  {
    src: '/Ellipse 6.png',
    alt: 'ellipse6-top',
    right: 0,
    top: 70,
    width: 90,
    height: 100,
  },
  {
    src: '/Ellipse 2.png',
    alt: 'ellipse2',
    right: 100,
    top: 100,
    width: 140,
    height: 140,
  },
  {
    src: '/Ellipse 1.png',
    alt: 'ellipse1',
    right: 180,
    top: 270, // shifted down for spacing
    width: 100,
    height: 150,
  },
  {
    src: '/Ellipse 4.png',
    alt: 'ellipse4',
    right: 100,
    top: 430, // more spacing below
    width: 140,
    height: 140,
  },
  {
    src: '/Ellipse 5.png',
    alt: 'ellipse5',
    right: 0,
    top: 480,
    width: 90,
    height: 100,
  },
  {
    src: '/Group 1.png',
    alt: 'group1-circle',
    // adjust as per design
    top: 170,    // adjust as needed
    width: 90,
    right: 400,
    height: 90,
    rotate: -45,
  },
  {
    src: '/Group 1.png',
    alt: 'group1-circle',
    // adjust as per design
    top: 470,    // adjust as needed
    width: 120,
    right: 860,
    height: 120,
    rotate: -45,
  },
];

const EllipseCurveRight = () => (
  <>
    {ellipses.map((ellipse, idx) => (
      <img
        key={ellipse.alt + idx}
        src={ellipse.src}
        alt={ellipse.alt}
        className="absolute z-0"
        style={{
          width: `${ellipse.width}px`,
          height: `${ellipse.height}px`,
          right: `${ellipse.right}px`,
          top: ellipse.top !== undefined ? `${ellipse.top}px` : undefined,
          bottom: ellipse.bottom !== undefined ? `${ellipse.bottom}px` : undefined,
          transform: ellipse.rotate !== undefined ? `rotate(${ellipse.rotate}deg)` : undefined,
        }}
      />
    ))}
  </>
);

export default EllipseCurveRight;
