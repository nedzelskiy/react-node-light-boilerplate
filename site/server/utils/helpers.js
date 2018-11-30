/* eslint-disable prefer-destructuring */
const getMimeType = (ext) => {
  let mimeType = 'text/plain';
  switch (ext) {
    case 'css':
      mimeType = 'text/css';
      break;
    case 'js':
      mimeType = 'text/javascript';
      break;
    case 'html':
      mimeType = 'text/html';
      break;
    case 'json':
      mimeType = 'application/json';
      break;
    default:
      mimeType = 'text/plain';
  }
  return mimeType;
};

const getLanguageFromHeaders = (langsLine, acceptedLangs) => {
  let lang = null;
  if (langsLine) {
    langsLine.split(';').some((langLine) => {
      lang = acceptedLangs.filter((l) => { return langLine.toLowerCase().match(l); });
      if (lang.length > 0) {
        lang = lang[0];
      }
      return lang;
    });
  }
  return lang;
};

const log = (err) => {
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

const throwError = (message, code, params) => {
  const error = new Error(message);
  error.code = code;
  error.params = params;
  log(error);
  throw error;
};


module.exports = {
  getLanguageFromHeaders,
  log,
  throwError,
  getMimeType,
};
