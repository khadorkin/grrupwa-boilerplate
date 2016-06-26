import { createStore, combineReducers, applyMiddleware } from 'redux';
import ApolloClient from 'apollo-client';
import { routerReducer } from 'react-router-redux';
const client = new ApolloClient();

export default () => {
  const store = createStore(
    combineReducers({
      routing: routerReducer,
      apollo: client.reducer(),
    }),
    applyMiddleware(client.middleware())
  );

  return store;
};
