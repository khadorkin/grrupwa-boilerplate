import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class App extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  }


  static childContextTypes = {
    isOnline: React.PropTypes.bool,
  };

  getChildContext() {
    return {
      isOnline: true,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.updateOfflineStatus = this.updateOfflineStatus.bind(this);
  }

  state = {
    isOnline: true,
  };

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

  updateOnlineStatus(event) {
    this.setState({ isOnline: true });
  }

  updateOfflineStatus(event) {
    this.setState({ isOnline: false });
  }

  render() {
    const { isOnline } = this.state;

    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/PageA">PageA</Link>
        <Link to="/PageB">PageB</Link>
        {this.props.children}
        <div>Current status: {isOnline ? 'Online' : 'Offline'}</div>
      </div>
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
