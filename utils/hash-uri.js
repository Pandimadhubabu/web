import md5 from 'md5';

function hashUri(data) {
  return `https://cdn-web.757live.workers.dev/object/${md5(JSON.stringify(data))}`;
}

export default hashUri;
