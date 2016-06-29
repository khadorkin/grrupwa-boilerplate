import React from 'react';
import ReactDOM from 'react-dom';

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
      React.cloneElement(containerElement, { relay: relaySpec }),
      document.createElement('div')
    );
  },
  wrapRelayOptions(component, relayOptions = {}) {
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
    return React.cloneElement(component, { relay: relaySpec });
  },
};

export default RelayTestUtils;
