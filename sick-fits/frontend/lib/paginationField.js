import { PAGINATION_QUERY } from '../components/Pagination';

const paginationField = () => ({
  keyArgs: false, // tells Apollo we will take care of everything
  read(existing = [], { args, cache }) {
    const { skip, first } = args;
    // Read the number of items on the page from the cache
    const data = cache.readQuery({ query: PAGINATION_QUERY });
    const count = data?._allProductsMeta?.count;
    const page = skip / first + 1;
    const pages = Math.ceil(count / first);

    // check if we have existing items
    const items = existing.slice(skip, skip + first).filter((x) => x);

    // if there are items, and there are not enough items to satisfy how many are requested
    // and on the last page
    // then just send the item(s) left (send what we have even if not full page)
    if (items.length && items.length !== first && page === pages) {
      return items;
    }
    if (items.length !== first) {
      // we dont have any items, must fetch
      return false;
    }
    //  if there are items, return them from cache
    if (items.length) {
      return items;
    }
    // fallback
    return false;
  },
  merge(existing, incoming, { args }) {
    const { skip, first } = args;
    // runs when the Apollo client comes back from the network with the products
    const merged = existing ? existing.slice(0) : [];
    // eslint-disable-next-line no-plusplus
    for (let i = skip; i < skip + incoming.length; ++i) {
      merged[i] = incoming[i - skip];
    }
    // return the merged item from the cache
    return merged;
  },
});

export default paginationField;
