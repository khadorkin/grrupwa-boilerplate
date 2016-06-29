import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import AppShell from '../components/AppShell';
import styles from './App.css';

export class App extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  }

  static childContextTypes = {
    isOnline: React.PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.updateOfflineStatus = this.updateOfflineStatus.bind(this);
  }

  state = {
    isOnline: true,
  };

  getChildContext() {
    return {
      isOnline: true,
    };
  }

  componentDidMount() {
    // This library does not support SSR, and since it is browser-specific
    // We initialize it here, as global "Offline"
    require('offline-js');
    Offline.on('up', this.updateOnlineStatus);
    Offline.on('down', this.updateOfflineStatus);
  }

  componentWillUnmount() {
    Offline.off('up', this.updateOnlineStatus);
    Offline.off('down', this.updateOfflineStatus);
  }

  updateOnlineStatus() {
    this.setState({ isOnline: true });
  }

  updateOfflineStatus() {
    this.setState({ isOnline: false });
  }

  render() {
    const { isOnline } = this.state;

    return (
      <AppShell>
        <Link to="/">Home</Link>
        <Link to="/page/PageA">PageA</Link>
        <Link to="/page/PageB">PageB</Link>
        <Link to="/protected">Protected</Link>
        {this.props.children}
        <div className={styles.status}>Current status: {isOnline ? 'Online' : 'Offline'}</div>
      </AppShell>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
