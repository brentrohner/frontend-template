import React from 'react';
import NavBar from '../../NavBar';
import styles from './HomePage.module.scss';

export default function HomePage(): JSX.Element {
  return (
    <div className={styles.HomePage}>
      <NavBar />
    </div>
  );
}
