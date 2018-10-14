import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics'
import { storeShape, subscriptionShape } from '../utils/PropTypes'


// connect() is a function that injects Redux-related props into your component.
// You can inject data and callbacks that change that data by dispatching actions.
export default function connectHOC(mapStateToProps, mapDispatchToProps) {
  // It lets us inject component as the last step so people can use it as a decorator.
  // Generally you don't need to worry about it.
  return function wrapWithConnect(WrappedComponent) {
    const storeKey = 'store';
    const subscriptionKey = storeKey + 'Subscription';
    const displayName = `ConnectAdvanced(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    const contextTypes = {
      [storeKey]: storeShape,
      [subscriptionKey]: subscriptionShape,
    }
    const childContextTypes = {
      [subscriptionKey]: subscriptionShape,
    }

    // It returns a component
    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this.store = props[storeKey] || context[storeKey];
        // ...subscribtion
      }

      componentDidMount() {
        // it remembers to subscribe to the store so it doesn't miss updates
        this.unsubscribe = this.store.subscribe(this.handleChange)
      }

      componentWillUnmount() {
        // and unsubscribe later
        this.unsubscribe()
      }

      handleChange = () => {
        // and whenever the store state changes, it re-renders.
        this.forceUpdate()
      }

      render() {
        return (
          // that renders your component
          <WrappedComponent
            {/* with its props  */}
            {...this.props}
            {/* and additional props calculated from Redux store */}
            {...mapStateToProps(this.store.getState(), this.props)}
            {...mapDispatchToProps(this.store.dispatch, this.props)}
          />
        )
      }
    }

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;
    Connect.propTypes = contextTypes;

    return hoistStatics(Connect, WrappedComponent);
  }
}
