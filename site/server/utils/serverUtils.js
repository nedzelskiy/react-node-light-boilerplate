/* eslint-disable no-param-reassign, global-require, no-nested-ternary, import/no-unresolved */
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import config from '../../configs';
import App from '../../client/components/App';
import Html from '../../client/components/Html';
import { getLanguageFromHeaders, getMimeType } from './helpers';
import configureStore from '../../client/configureStore';
import {
  updateRoute,
  addTranslations,
  setManifest,
  setErrorParams,
} from '../../client/components/App/actions';
import ErrorPage from '../../client/components/pages/ErrorPage';
import initialState from '../../client/components/App/initialState';
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

export const initStoreWithDispatch = (req, store, context) => {
  const lang = context.language ? context.language : getLanguage(req);
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
  if (route.pageName !== 'error') {
    const translations = getTranslations(lang);
    store.dispatch(addTranslations(lang, translations));
  } else {
    store.dispatch(setErrorParams(context.error));
  }
  return {
    route,
    context,
  };
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
  initStoreWithDispatch(req, store, context);
  return renderHtmlWithStore(req, store, context);
};

export const renderServerErrorPage = (req) => {
  const lang = getLanguage(req);
  const store = {
    getState: () => {
      return {
        App: {
          ...initialState,
          route: {
            params: {
              language: lang,
            },
          },
          manifest: getManifest(),
        },
      };
    },
  };
  // TODO translate text
  return ReactDOM.renderToStaticMarkup(
    <Html store={store} isServerErrorPage={true}>
      <StaticRouter location={req.originalUrl}>
        <ErrorPage
          language={lang}
          code={500}
          message="Something went wrong!"
        />
      </StaticRouter>
    </Html>,
  );
};

export const renderHtmlWithStore = (req, store, context) => {
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

export const log = (err) => {
  if (
    !process.env.NODE_ENV
    || process.env.NODE_ENV !== 'production'
  ) {
    console.log(err);
  } else {
    console.log('!!!!!!!!!! log in production!');
    console.log(err);
  }
};

const getRoute = (req) => {
  const route = getMatchedRoute(req.originalUrl);
  if (!route) {
    return getErrorRoute(req.originalUrl);
  }
  return route;
};

export const throwError = (message, code, params) => {
  const error = new Error(message);
  error.code = code;
  error.params = params;
  log(error);
  throw error;
};
