import Article from '../article';
import PageTitle from '../page-title';

function Item({
  resource: {
    name,
    url,
    summary,
    image,
    published,
    attributedTo,
  },
}) {
  const { origin } = new URL(url);

  return (
    <>
      <PageTitle parts={[name, attributedTo.name]} />
      <div className="container mt-3">
        <div className="row">
          <div className="col col-lg-8 offset-lg-2">
            <Article
              // Move the source to `attributedTo`
              source={origin}
              name={name}
              url={url}
              summary={summary}
              image={image}
              attributedTo={attributedTo}
              published={published}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Item;