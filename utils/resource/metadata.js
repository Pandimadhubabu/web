import getResourcePath from './path';

const URL_BASE = 'https://cdn-web.757live.workers.dev';

function createTitle(...pieces) {
  return pieces.filter((part) => !!part).join(' | ');
}

function getResourceMetadata(resource, appName = 'Chickaree') {
  const og = {};
  const schema = {
    '@context': 'http://schema.org/',
  };
  let robots;
  let title;

  if (!resource || !resource.url || !resource.url.href) {
    return {
      title,
      robots,
      og,
      schema,
    };
  }

  const resourceURL = new URL(resource.url.href);
  const url = new URL(getResourcePath(resource.url.href), URL_BASE);
  schema.url = url.toString();
  og.url = url.toString();

  if (resource.name) {
    schema.name = resource.name;
    og.title = resource.name;
  }

  if (resource.summary) {
    schema.description = resource.summary;
    og.description = resource.summary;
  }

  if (resource.image && resource.image.href) {
    schema.image = resource.image.href;
    schema.primaryImageOfPage = resource.image.href;
    og.image = resource.image.href;
  }

  if (resource.published) {
    schema.datePublished = resource.published;
  }

  if (resource.type) {
    switch (resource.type) {
      case 'OrderedCollection':
        schema['@type'] = 'ProfilePage';
        if (resource.attributedTo) {
          schema.about = {
            '@type': 'Brand',
            name: resource.attributedTo.name,
            description: resource.attributedTo.summary,
            logo: resource.attributedTo.icon && resource.attributedTo.icon.href
              ? resource.attributedTo.icon.href
              : undefined,
          };
        }
        schema.mainEntity = {
          '@id': url.toString(),
          '@type': 'ItemList',
          sameAs: resource.url.href,
          datePublished: schema.datePublished,
          itemListElement: (resource.orderedItems || []).map(({ url: itemurl }) => {
            const itemURL = new URL(getResourcePath(itemurl.href), URL_BASE);

            return {
              '@id': itemURL.toString(),
              '@type': 'Thing',
              url: itemURL.toString(),
              sameAs: itemurl.href,
            };
          }),
        };
        og.type = 'profile';
        if (resource.name) {
          title = createTitle(resource.name, appName);
        } else if (resource.attributedTo && resource.attributedTo.name) {
          title = createTitle(resource.attributedTo.name, appName);
        }

        // Since there is no way to know if a collection is private or not,
        // only allow indexing collections if they are in the root.
        if (resourceURL.pathname !== '/') {
          robots = 'none';
        }
        break;
      case 'Article':
        schema['@type'] = 'ItemPage';
        schema.mainEntity = {
          '@id': url.toString(),
          '@type': 'SocialMediaPosting',
          url: url.toString(),
          datePublished: schema.datePublished,
          sharedContent: {
            '@type': 'Article',
            title: schema.title,
            description: schema.description,
            image: schema.image,
            url: resource.url.href,
            datePublished: schema.datePublished,
          },
        };

        if (resource.attributedTo) {
          const { origin } = new URL(resource.url.href);
          const originURL = new URL(getResourcePath(origin), URL_BASE);

          schema.mainEntity.author = {
            '@id': originURL.toString(),
            '@type': 'Organization',
            name: resource.attributedTo.name,
            description: resource.attributedTo.summary,
            url: originURL.toString(),
            sameAs: origin,
            brand: {
              '@type': 'Brand',
              logo: resource.attributedTo.icon && resource.attributedTo.icon.href
                ? resource.attributedTo.icon.href
                : undefined,
            },
          };
        }

        og.type = 'article';
        title = createTitle(resource.name, resource.attributedTo.name, appName);
        break;
      default:
        og.type = 'website';
        title = createTitle(appName);
        break;
    }
  }

  return {
    title,
    robots,
    og,
    schema,
  };
}

export default getResourceMetadata;
