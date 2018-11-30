import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { withRouter } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { updateRoute } from './actions';
import ErrorPage from '../pages/ErrorPage';
import NotFoundPage from '../pages/NotFoundPage';
import { isThisIsBrowser } from '../../utils/helpers';
import { getErrorRoute } from '../../../common/helpers';
import { setLangCookieIfNew } from '../../utils/cookie';
import { createUrlByName, getMatchedRoute } from '../../../common/utils';
import './styles.scss';

class App extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    matchedRoute: PropTypes.object,
    route: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    updateRoute: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: undefined,
    matchedRoute: null,
  };

  static updateRoute(updateFunc, props) {
    const newRouterState = {
      pageName: props.matchedRoute.pageName,
      prevUrl: props.route.prevUrl,
      currentUrl: props.history.location.pathname,
      path: props.matchedRoute.path,
      params: props.matchedRoute.params,
    };
    if (isEqual(newRouterState, props.route)) {
      return false;
    }
    newRouterState.prevUrl = props.route.currentUrl;
    updateFunc(newRouterState);
    return true;
  }

  static getErrorRoute(props) {
    return {
      ...getErrorRoute(props.location.pathname),
      prevUrl: props.route.currentUrl,
      params: props.route.params,
    };
  }

  componentWillMount() {
    this.updateCurrentRoute(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return isThisIsBrowser()
      ? this.updateCurrentRoute(nextProps)
      : false;
  }

  componentDidMount() {
    setLangCookieIfNew(this.props.language);
  }

  updateCurrentRoute(props) {
    if (props.location.pathname === '/') {
      props.history.push(createUrlByName('home', { ...props }));
      return false;
    }
    return props.matchedRoute
      ? App.updateRoute(this.props.updateRoute, props)
      : App.updateRoute(this.props.updateRoute, {
        ...props,
        matchedRoute: App.getErrorRoute(props),
      });
  }

  renderNotFoundPage() {
    return (
      <NotFoundPage
        language={this.props.language}
      />
    );
  }

  renderErrorPage() {
    if (this.props.error.code === 404) {
      return this.renderNotFoundPage();
    }
    if (
      this.props.error.code
      && this.props.error.message
    ) {
      return (
        <ErrorPage
          code={this.props.error.code}
          language={this.props.language}
          message={this.props.error.message}
        />
      );
    }
    return this.renderNotFoundPage();
  }

  renderContent() {
    if (!this.props.matchedRoute) {
      return this.renderErrorPage();
    }
    return (
      <Route
        {...this.props.matchedRoute}
        key={this.props.matchedRoute.path}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        {this.renderContent()}
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(connect((state, ownProps) => {
  return {
    route: state.App.route,
    error: state.App.error,
    language: state.App.route.params.language,
    matchedRoute: getMatchedRoute(ownProps.location.pathname),
  };
}, {
  updateRoute,
})(App));
