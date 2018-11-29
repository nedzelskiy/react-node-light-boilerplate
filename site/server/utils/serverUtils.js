/* eslint-disable no-param-reassign, global-require, no-nested-ternary, import/no-unresolved */
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import config from '../../configs';
import App from '../../client/components/App';
import Html from '../../client/components/Html';
import { getLanguageFromHeaders } from './helpers';
import configureStore from '../../client/configureStore';
import {
  updateRoute,
  addTranslations,
  setManifest,
  setErrorParams,
} from '../../client/components/App/actions';
import { getMatchedRoute, isAcceptedLang } from '../../common/utils';
import { getErrorRoute } from '../../common/helpers';

export const getTranslations = (lang) => {
  try {
    return require(`../i18n/${lang}.json`);
  } catch (e) {
    return null;
  }
};

export const getLanguage = (req) => {
  const lang = req.params && req.params.lang ? req.params.lang : null;
  if (!lang) {
    return getCheckedLang(req, lang);
  }
  return lang;
};

export const getManifest = () => {
  try {
    return require('../../static/manifest');
  } catch (e) {
    log(new Error('Couldn\'t get manifest!'));
    return {};
  }
};

const initStoreWithDispatch = (req, store, context) => {
  const lang = context.language || getLanguage(req);
  const route = (context.pageName && context.pageName === 'error')
    ? getErrorRoute(req.originalUrl)
    : isAcceptedLang(lang)
      ? getRoute(req)
      : getErrorRoute(req.originalUrl);

  store.dispatch(updateRoute({
    pageName: route.pageName,
    prevUrl: req.originalUrl,
    currentUrl: req.originalUrl,
    path: route.path || req.originalUrl,
    params: route.params || {
      language: getCheckedLang(req, lang),
    },
  }));
  store.dispatch(setManifest(getManifest()));
  store.dispatch(addTranslations(lang, getTranslations(lang)));
  if (route.pageName === 'error') {
    store.dispatch(setErrorParams(context.error));
  }
  return store;
};

export const getLangCookie = (req) => {
  if (
    req.cookies
    && req.cookies.lang
    && isAcceptedLang(req.cookies.lang)
  ) {
    return req.cookies.lang;
  }
  return null;
};

export const getCheckedLang = (req, language) => {
  let lang = language;
  if (!isAcceptedLang(lang)) {
    lang = getLangCookie(req);
    if (!lang) {
      lang = getLanguageFromHeaders(req.headers['accept-language'], config.acceptedLanguages);
      if (!lang) {
        lang = config.defaultLanguage;
      }
    }
  }
  return lang;
};

export const renderHtml = (req, context) => {
  const { store } = configureStore({});
  return renderHtmlToString(req, initStoreWithDispatch(req, store, context), context);
};

const renderHtmlToString = (req, store, context) => {
  return ReactDOM.renderToStaticMarkup(
    <Html store={store}>
      <Provider store={store}>
        <StaticRouter location={req.originalUrl} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    </Html>,
  );
};

const getRoute = (req) => {
  const route = getMatchedRoute(req.originalUrl);
  if (!route) {
    return getErrorRoute(req.originalUrl);
  }
  return route;
};

