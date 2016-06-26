import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router/es6';

class Page extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    return (
      <section className="main">
        {this.props.viewer.items.edges.map(({ node }) => (
          <div key={node.id}>
            {node.text}
          </div>
        ))}
      </section>
    );
  }
}

export default Relay.createContainer(Page, {
  initialVariables: {
    category: 'any',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        items(first: 10, category: $category) {
          edges {
            node {
              id
              text
              category
            }
          }
        }
      }
    `,
  },
});
