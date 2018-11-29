import get from 'get-value';
import {
  call, takeEvery, select, put,
} from 'redux-saga/effects';
import * as constants from './constants';
import { getTranslations as getTranslationsAction, addTranslations } from './actions';
import { isThisIsBrowser } from '../../utils/helpers';
import { setLangCookieIfNew } from '../../utils/cookie';
import { setLangInHtmlTag } from '../../utils/frontendUtils';
import { getTranslations as getTranslationsAPI } from '../../utils/api';


function* updateParamsInState(action) {
  const { language } = action.payload.params;
  yield call(setLangInHtmlTag, language);
  yield call(setLangCookieIfNew, language);
  const state = yield select((s) => {
    return s;
  });
  if (!get(state.App.i18n, language)) {
    yield put(getTranslationsAction(language));
  }
}

function* watchRouteChanged() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.UPDATE_ROUT, updateParamsInState);
  }
}

function* getTranslations(action) {
  try {
    const language = action.payload;
    const translations = yield call(getTranslationsAPI, language);
    yield put(addTranslations(language, translations));
  } catch (e) {
    yield;
  }
}


function* watchGetTranslations() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.GET_TRANSLATIONS, getTranslations);
  }
}


export default [
  watchRouteChanged(),
  watchGetTranslations(),
];
