/* eslint-disable import/prefer-default-export */
import { matchPath } from 'react-router-dom';
import { compile } from 'path-to-regexp';
import routes from '../client/components/App/routes';
import config from '../configs';

export const getMatchedRoute = (url) => {
  if (!getMatchedRoute.cache) {
    getMatchedRoute.cache = {};
  }
  const cachedRoute = getMatchedRoute.cache[url];
  if (typeof getMatchedRoute.cache[url] !== 'undefined') {
    return cachedRoute;
  }
  let route = null;
  routes.some((r) => {
    const match = matchPath(url, r);
    if (
      match
      && (!match.params.language || isAcceptedLang(match.params.language))
    ) {
      route = r;
      route.params = match.params;
      route.currentUrl = url;
      return true;
    }
    return false;
  });
  getMatchedRoute.cache[url] = route
    ? { ...route }
    : null;
  return route;
};

export function createUrlByName(routeName, routeParams) {
  try {
    return compile(routes.filter((route) => {
      return route.pageName === routeName;
    })[0].path)(routeParams);
  } catch (err) {
    return null;
  }
}

export const isAcceptedLang = (lang) => {
  return config.acceptedLanguages.includes(lang);
};
