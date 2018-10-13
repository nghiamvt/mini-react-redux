import { Component } from 'react';
import PropTypes from 'prop-types';
import { storeShape, subscriptionShape } from '../utils/PropTypes'

export function createProvider(storeKey = 'store') {
  const subscriptionKey = `${storeKey}Subscription`;

  class Provider extends Component {

  }

  Provider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  };

  Provider.childContextTypes = {
    [storeKey]: storeShape.isRequired,
    [subscriptionKey]: subscriptionShape,
  };

  return Provider;
}

export default createProvider();
