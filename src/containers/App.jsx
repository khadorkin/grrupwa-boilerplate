import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class App extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/PageA">PageA</Link>
        <Link to="/PageB">PageB</Link>
        {this.props.children}
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
