import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router/es6';

class PageB extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    return (
      <section className="main">
        PageB <Link to="/">Go to Page A</Link>
      </section>
    );
  }
}

export default Relay.createContainer(PageB, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
