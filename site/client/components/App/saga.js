import { call, takeEvery } from 'redux-saga/effects';
import * as constants from './constants';
import { setLangCookie, getLangCookie } from '../../utils/cookie';
import { isThisIsBrowser } from '../../utils/helpers';
import { setLangInHtmlTag } from '../../utils/frontendUtils';


function* updateParamsInState(action) {
  const { language } = action.payload.params;
  yield call(setLangInHtmlTag, language);
  if (getLangCookie() !== language) {
    yield call(setLangCookie, language);
  }
}

function* watchRouteChanged() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.UPDATE_ROUT, updateParamsInState);
  }
}

export default [
  watchRouteChanged(),
];
