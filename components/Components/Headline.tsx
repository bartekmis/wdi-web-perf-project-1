import React from 'react';

const elements = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
} as any;

const Headline = ({ type = 'h2', children, ...props }: any) => {
  return React.createElement(
    elements[type] || elements.h2,
    props,
    children
  );
};

export default Headline;
