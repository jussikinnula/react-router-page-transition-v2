import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Router } from 'react-router'
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import App from './App';

const element = document.createElement('div');
document.body.appendChild(element);
const history = createHistory();

render(
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>,
  element,
  null
);
