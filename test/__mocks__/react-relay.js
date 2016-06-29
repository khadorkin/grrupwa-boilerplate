const Relay = require.requireActual('react-relay');

export default {
  Environment: Relay.Environment,
  Mutation: Relay.Mutation,
  QL: Relay.QL,
  PropTypes: Relay.PropTypes,
  Route: Relay.Route,
  Store: {
    update: jest.genMockFn(),
  },
  createContainer: (component, containerSpec = {}) => {
    const fragments = containerSpec.fragments;

    // mock the static container methods
    Object.assign(component, {
      getFragment: (fragmentName) => fragments[fragmentName],
    });

    return component;
  },
};
