import React from 'react';
import * as styles from './style.module.scss';

export default function Main(props) {
  return (
    <div className={styles.mainContainer}>
      {props.children}
    </div>
  );
};
