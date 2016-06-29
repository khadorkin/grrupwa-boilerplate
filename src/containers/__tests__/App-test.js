jest.unmock('../App');

import React from 'react';
import Relay from 'react-relay';
import ReactTestUtils from 'react-addons-test-utils';
import RelayTestUtils from '../../../test/RelayTestUtils';
import { mount } from 'enzyme';
import App from '../App';

describe('App', () => {
  it('Container can mount', () => {
    const wrapper = mount(RelayTestUtils.wrapRelayOptions(<App />), {
      context: { relay: new Relay.Environment() },
    });
  });
});

// https://github.com/reactjs/react-router/issues/465 for react router testing
