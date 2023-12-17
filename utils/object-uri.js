import slugify from 'slugify';

function objectUri(text) {
  return `https://cdn-web.757live.workers.dev/object/${slugify(text, { lower: true })}`;
}

export default objectUri;
