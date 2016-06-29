import React from 'react';
import Relay from 'react-relay';

export class ProtectedPage extends React.Component {
  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    return (
      <div>
        User ID {this.props.viewer.id}
      </div>
    );
  }
}

export default Relay.createContainer(ProtectedPage, {
  initialVariables: {
    category: 'any',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
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
