jest.unmock('../App');

import React from 'react';
import Relay from 'react-relay';
import RelayTestUtils from '../../../test/RelayTestUtils';
import { mount } from 'enzyme';
import { App } from '../App';

describe('App', () => {
  it('Container can mount', () => {
    const wrapper = mount(<App />, { context: { relay: new Relay.Environment() } });
  });

  it('RelayContainer can render', () => {
    const AppRelayContainer = RelayTestUtils.renderContainerIntoDocument(
      <App />,
      {}
    );
  });
});
