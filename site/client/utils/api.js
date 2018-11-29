/* eslint-disable import/prefer-default-export */
import { getGetRequest } from './frontendUtils';

export const getTranslations = (lang, params) => {
  return getGetRequest(`/i18n/${lang}`, params);
};
