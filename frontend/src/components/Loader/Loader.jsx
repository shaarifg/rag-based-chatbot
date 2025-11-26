import React from 'react';
import './Loader.scss';

const Loader = ({ message = 'Loading' }) => {
  return (
    <div className="loader">
      <div className="loader__spinner">
        <div className="loader__spinner-ring"></div>
        <div className="loader__spinner-ring"></div>
        <div className="loader__spinner-ring"></div>
      </div>
      <div className="loader__text">
        {message}
        <span className="loader__dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
};

export default Loader;
