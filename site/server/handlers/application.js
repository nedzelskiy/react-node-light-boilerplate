import { renderHtml } from '../utils/serverUtils';
import { getMatchedRoute } from '../../common/utils';
import { getMimeType, throwError } from '../utils/helpers';

export default (req, res) => {
  if (!getMatchedRoute(req.originalUrl)) {
    throwError(
      `Route "${req.originalUrl}" not found!`,
      'ENOENT',
      req.params,
    );
    return null;
  }
  const context = {};
  const html = renderHtml(req, context);
  if (!context.url) {
    res.setHeader('Content-Type', getMimeType('html'));
    res.statusCode = 200;
    return res.end(html);
  }
  res.writeHead(302, {
    Location: context.url,
  });
  res.statusCode = 302;
  return res.end();
};
