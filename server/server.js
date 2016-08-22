import Express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import util from 'util';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import routes from '../src/routes';
import Html from '../src/helpers/Html';
import webpackConfig from '../webpack/dev-config';

import stripe from './api/stripe';

const app = Express();
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  noInfo: true,
  publicPath: webpackConfig.output.publicPath })
);

app.use(webpackHotMiddleware(compiler));
app.use(Express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SIMPLE API PROTOTYPE
// ----------------------

// TODO: proper routing?
// TODO: check for POST

app.use('/api/stripe/customers', function(req, res) {
  stripe.create_customer(req.body, (error, customer) => {
    if (!error) {
      res.status(200);
      res.json(customer);
    }
    else {
      res.status(500);
      res.json(error);
    }
  });
});

app.use('/api/stripe/charges', function(req, res) {
  stripe.create_charge(req.body, (error, customer) => {
    if (!error) {
      res.status(200);
      res.json(customer);
    }
    else {
      res.status(500);
      res.json(error);
    }
  });
});

// ---

app.use('/', function (req, res) {

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      const component = <RouterContext {...renderProps} />;

      res.status(200);
      res.send('<!doctype html>\n' +
      renderToString(<Html component={component} />));
    } else {
      res.status(404).send('Not found');
    }
  });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  util.log('try-auth app listening at http://%s:%s', host, port);
});
