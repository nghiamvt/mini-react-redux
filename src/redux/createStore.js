/**
 * Creates a Redux store that holds the state tree.
 * @param {Function} reducer A function that returns the next state tree
 * @param {Object} preloadedState The initial state
 * @param {Function} enhancer The store enhancers such as middleware, time travel, persistence.
 * The only store enhancer that ships with Redux is `applyMiddleware()`.
 *
 * @returns A Redux store that lets you read the s, dispatch actions and subscribe to changes.
 */
export default function createStore(reducer, preloadedState, enhancer) {
  let currentReducer = reducer;
  let currentState = preloadedState;
  let listeners = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = currentReducer(currentState, action);
    listeners.forEach(listener => listener());
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    }
  }

  dispatch({ type: '@@redux/INIT' });

  return {
    getState,
    dispatch,
    subscribe
  };
}
