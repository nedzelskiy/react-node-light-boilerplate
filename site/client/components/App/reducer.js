import get from 'get-value';
import cloneDeep from 'lodash/cloneDeep';
import * as constants from './constants';
import initialState from './initialState';

export default function (state = initialState, action) {
  const newState = cloneDeep(state);
  switch (action.type) {
    case constants.UPDATE_ROUT:
      newState.route = {
        ...initialState.route,
        ...action.payload,
      };
      break;

    case constants.CLEAR_APP_ERROR_PARAMS:
      newState.error.message = initialState.error.message;
      newState.error.code = initialState.error.code;
      break;

    case constants.ADD_APP_ERROR_PARAMS: {
      const { message, code } = action.payload;
      newState.error.message = message;
      newState.error.code = code;
      break;
    }

    case constants.ADD_MANIFEST:
      newState.manifest = action.payload;
      break;

    case constants.ADD_TRANSLATIONS: {
      const { lang, translations } = action.payload;
      if (!get(newState, `i18n.${lang}`)) {
        newState.i18n[lang] = {};
      }
      newState.i18n[lang] = Object.assign(newState.i18n[lang], translations);
      break;
    }

    default:
      break;
  }

  return newState;
}
