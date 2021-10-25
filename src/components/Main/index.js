import React from 'react';
import './style.css';

export default function Main(props) {
  return (
    <div className="mainContainer">
      {props.children}
    </div>
  );
};
