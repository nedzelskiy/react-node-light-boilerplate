/* eslint-disable no-multi-assign */
import {
  renderHtml,
  getLanguage,
} from '../utils/serverUtils';

export default (err, req, res) => {
  if (err) {
    const context = {
      language: err.params && err.params.lang
        ? err.params.lang
        : getLanguage(req),
      pageName: 'error',
      error: {
        message: err.message,
      },
    };
    switch (err.code) {
      case 'ENOENT':
      case 'EISDIR':
      case '404':
      case 404:
        context.error.code = res.statusCode = 404;
        break;
      default:
        context.error.code = res.statusCode = 500;
    }
    const html = renderHtml(req, context);
    res.statusCode = 200;
    return res.end(html);
  }
  res.statusCode = 500;
  return res.end('route can\'t be managed!');
};
