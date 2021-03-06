import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import store from './store';

const history = syncHistoryWithStore(browserHistory, store);

const component = (
  <Router routes={routes} history={history} />
);

history.listen((location) => {
  const ga = window.ga;
  if (ga) {
    ga('send', {
      hitType: 'pageview',
      page: location.pathname
    });
  }
});

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        { component }
      </Provider>
    );
  }
}
