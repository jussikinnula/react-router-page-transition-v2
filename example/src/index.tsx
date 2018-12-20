import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom'
import App from './App';

const element = document.createElement('div');
document.body.appendChild(element);

render(
  <Router>
    <Route path="/" component={App} />
  </Router>,
  element,
  null
);
