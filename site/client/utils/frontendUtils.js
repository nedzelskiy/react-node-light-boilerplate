/* eslint-disable no-param-reassign, no-multi-assign, prefer-destructuring */
import axios from 'axios';
import get from 'get-value';
import { Promise } from 'es6-promise';
import config from '../../configs';
import { getLangCookie } from './cookie';
import { isAcceptedLang } from '../../common/utils';

export const setLangInHtmlTag = (lang) => {
  if (!get(setLangInHtmlTag, 'htmlTag')) {
    setLangInHtmlTag.htmlTag = document.getElementsByTagName('html')[0];
  }
  setLangInHtmlTag.htmlTag.setAttribute('lang', getCheckedLang(lang));
};

export const getCheckedLang = (language) => {
  let lang = language;
  if (!isAcceptedLang(lang)) {
    lang = getLangCookie();
    if (!lang) {
      lang = config.defaultLanguage;
    }
  }
  return lang;
};

export const getGetRequest = (url, params) => {
  return axios
    .create({
      params,
    })
    .get(url)
    .then((response) => {
      return response.data;
    });
};
