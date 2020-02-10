import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import useScrollBox from './useScrollBox';
import './scrollBox.css';

function ScrollBox({ children }) {
  const scrollWrapperRef = useRef();
  const { isDragging } = useScrollBox(scrollWrapperRef);
  return (
    <div className="scroll-box">
      <div className="scroll-box__wrapper" ref={scrollWrapperRef}>
        <div className="scroll-box__container" role="list" style={{ pointerEvents: isDragging ? 'none' : undefined }}>
          {children.map((child, i) => (
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
