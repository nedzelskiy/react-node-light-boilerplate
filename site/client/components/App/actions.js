import * as constants from './constants';

export const setErrorParams = ({ code, message }) => {
  return {
    type: constants.ADD_APP_ERROR_PARAMS,
    payload: { code, message },
  };
};

export const clearErrorParams = () => {
  return {
    type: constants.CLEAR_APP_ERROR_PARAMS,
  };
};

export const updateRoute = (route) => {
  return {
    type: constants.UPDATE_ROUT,
    payload: route,
  };
};

export const setManifest = (manifest) => {
  return {
    type: constants.ADD_MANIFEST,
    payload: manifest,
  };
};

export const addTranslations = (lang, translations) => {
  return {
    type: constants.ADD_TRANSLATIONS,
    payload: { lang, translations },
  };
};
