/* eslint-disable react/no-danger */
import React from 'react';
import get from 'get-value';
import serialize from 'serialize-javascript';
import PropTypes from 'prop-types';

export default class Html extends React.PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const state = this.props.store.getState();
    const m = state.App.manifest || {};
    const lang = state.App.route.params.language;
    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" type="text/css" href={`/static/css/app.css?${get(m, 'app.css')}`} />
          <title />
        </head>
        <body>
          <div id="app">{ this.props.children }</div>
          <script id="state" dangerouslySetInnerHTML={{ __html: `window.state=${serialize(state)};` }} />
          <script type="text/javascript" src={`/static/js/vendors.js?${get(m, 'vendors.js')}`} />
          <script type="text/javascript" src={`/static/js/app.js?${get(m, 'app.js')}`} />
        </body>
      </html>
    );
  }
}
