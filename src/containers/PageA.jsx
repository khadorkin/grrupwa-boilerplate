import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router/es6';

class PageA extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    return (
      <section className="main">
        PageA <Link to="/b">Go to Page B</Link>
      </section>
    );
  }
}

export default Relay.createContainer(PageA, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
