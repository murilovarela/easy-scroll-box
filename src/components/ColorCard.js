import React from 'react';
import PropTypes from 'prop-types';
import './colorCard.css';

function ColorCard({ color }) {
  function handleColorCopy() {
    if (navigator) navigator.clipboard.writeText(color);
  }
  return (
    <div className="color-card" style={{ backgroundColor: color }}>
      <button className="color-card__code" onClick={handleColorCopy}>
        {color}
      </button>
    </div>
  );
}

ColorCard.propTypes = {
  color: PropTypes.string.isRequired,
};

export default ColorCard;
