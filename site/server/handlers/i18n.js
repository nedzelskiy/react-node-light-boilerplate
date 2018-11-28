import { getMimeType } from '../utils/helpers';
import { getTranslations } from '../utils/serverUtils';

export default (req, res) => {
  const i18n = getTranslations(req.params.lang);
  if (i18n) {
    res.setHeader('Content-Type', getMimeType('json'));
    return res.end(JSON.stringify(i18n));
  }
  res.statusCode = 400;
  return res.end(JSON.stringify({}));
};
