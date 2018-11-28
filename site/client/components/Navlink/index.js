import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createUrlByName } from '../../../common/utils';
import { addQueryToUrl } from '../../utils/helpers';

class Navlink extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string,
    style: PropTypes.object,
    query: PropTypes.string,
    children: PropTypes.any,
    replace: PropTypes.bool,
    title: PropTypes.string,
    routeName: PropTypes.string,
    isNewWindow: PropTypes.bool,
    className: PropTypes.string,
    routeParams: PropTypes.object,
  };

  static defaultProps = {
    to: null,
    style: {},
    query: null,
    title: null,
    className: '',
    children: null,
    replace: false,
    routeName: null,
    routeParams: {},
    isNewWindow: false,
  };

  getNavLinkProps() {
    const props = {
      style: this.props.style,
      query: this.props.query,
      title: this.props.title,
      replace: this.props.replace,
      className: this.props.className,
      target: this.getLinkTarget(),
      to: this.getLinkUrl(),
    };
    return props;
  }

  getLinkUrl() {
    if (this.props.to) {
      return addQueryToUrl(this.props.to, this.props.query);
    }

    let url;

    if (this.props.routeName) {
      url = createUrlByName(this.props.routeName, this.props.routeParams);
    }

    return addQueryToUrl(url, this.props.query);
  }

  getLinkTarget() {
    return this.props.isNewWindow ? '_blank' : '';
  }

  render() {
    const linkProps = this.getNavLinkProps();
    return (
      <Link
        {...linkProps}
      >
        {this.props.children}
      </Link>
    );
  }
}

export default Navlink;
