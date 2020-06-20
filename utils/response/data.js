import getResponseDataJson from './data-json';
import getResponseDataHTML from './data-html';
import getResponseDataXML from './data-xml';
import getResponseUrl from '../response-url';

export const MIME_TYPES = [
  'application/json',
  'application/rss+xml',
  'application/atom+xml',
  'text/html',
  'text/xml',
  'application/xml',
  'application/xhtml+xml',
];

async function getResponseData(response) {
  if (!response.headers.has('Content-Type')) {
    return null;
  }

  // @TODO Get data from Link headers

  let mimeType = response.headers.get('Content-Type').split(';').shift().trim();

  if (!MIME_TYPES.includes(mimeType)) {
    return null;
  }

  const url = getResponseUrl(response);

  if (mimeType === 'application/json') {
    const data = await response.json();
    return getResponseDataJson(url, data);
  }

  // DOMParser does not support rss/atom
  if (['application/rss+xml', 'application/atom+xml'].includes(mimeType)) {
    mimeType = 'application/xml';
  }

  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, mimeType);

  if (mimeType === 'text/html') {
    return getResponseDataHTML(url, doc);
  }

  return getResponseDataXML(url, doc);
}

export default getResponseData;
