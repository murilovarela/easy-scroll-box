import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './scrollBox.css';

function ScrollBox({ children }) {
  const scrollWrapperRef = useRef();

  return (
    <div className="scroll-box">
      <div className="scroll-box__wrapper" ref={scrollWrapperRef}>
        <div className="scroll-box__container" role="list">
          {children.map((child, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div role="listitem" key={`scroll-box-item-${i}`} className="scroll-box__item">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollBox;
