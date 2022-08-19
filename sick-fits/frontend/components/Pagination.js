import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query {
    _allProductsMeta {
      count
    }
  }
`;

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

// eslint-disable-next-line react/prop-types
export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationContainer>
      <PaginationStyles data-testid="pagination">
        <Head>
          <title>
            Sick Fits - Page {page} of {pageCount}
          </title>
        </Head>
        <Link href={`/products/${page - 1}`}>
          <a aria-disabled={page <= 1}>← Prev</a>
        </Link>
        <p>
          Page {page} of {pageCount}
        </p>
        <p>{count} Items Total</p>
        <Link href={`/products/${page + 1}`}>
          <a aria-disabled={page === pageCount}>Next →</a>
        </Link>
      </PaginationStyles>
    </PaginationContainer>
  );
}
