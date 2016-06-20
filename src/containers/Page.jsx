import React from 'react';
import Relay from 'react-relay';

class Page extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    return (
      <section className="main">
        Page
      </section>
    );
  }
}

export default Relay.createContainer(Page, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
});
