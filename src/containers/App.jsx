import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-apollo';

@connect(
  state => (
    {
      apollo: state.apollo,
    }
  )
)
export default class App extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/PageA">Page A</Link>
        <Link to="/PageB">Page B</Link>
        {this.props.children}
      </div>
    );
  }
}
