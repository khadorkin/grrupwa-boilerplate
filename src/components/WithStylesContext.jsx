/*
 * A simple wrapper to allow for inlining critical css on SSR
 * borrowed from https://github.com/kriasoft/isomorphic-style-loader/issues/15
 */
import { Component, PropTypes, Children } from 'react';

export default class WithStylesContext extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onInsertCss: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
  };

  getChildContext() {
    return { insertCss: this.props.onInsertCss };
  }

  render() {
    return Children.only(this.props.children);
  }
}
