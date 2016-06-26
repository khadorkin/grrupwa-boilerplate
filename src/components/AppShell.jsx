import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './AppShell.css';

const AppShell = ({ children }) => (
  <div className={styles.base}>
    {children}
  </div>
);

// We want to get the critical css only on the server
// In production, css will
export default __SERVER__ ? withStyles(styles)(AppShell) : AppShell;
