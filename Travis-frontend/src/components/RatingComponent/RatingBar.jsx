import React from 'react';
import './ratting.css'; // Import CSS file for styling

const RatingBar = ({ percentage }) => {
  return (
    <div className="rating-bar-container">
      <div className="rating-bar" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default RatingBar;
