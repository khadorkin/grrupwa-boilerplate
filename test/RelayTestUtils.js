import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class ContextProvider extends React.Component {
  static childContextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  getChildContext() {
    return {
      relay: new Relay.Environment(),
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const RelayTestUtils = {
  renderContainerIntoDocument(containerElement, relayOptions = {}) {
    const relaySpec = {
      forceFetch: jest.genMockFn(),
      getPendingTransactions: jest.genMockFn().mockImplementation(
        () => relayOptions.pendingTransactions
      ),
      hasOptimisticUpdate: jest.genMockFn().mockImplementation(
        () => relayOptions.hasOptimisticUpdate
      ),
      route: relayOptions.route || { name: 'MockRoute', path: '/mock' },
      setVariables: jest.genMockFn(),
      variables: relayOptions.variables || {},
    };

    return ReactDOM.render(
      <ContextProvider>
        {React.cloneElement(containerElement, { relay: relaySpec })}
      </ContextProvider>,
      document.createElement('div')
    );
  },
};

export default RelayTestUtils;
