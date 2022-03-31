// custome hook to return user
import { gql, useQuery } from '@apollo/client';

// authenticatedItem is a Union, when User(type) is returned, get id, email etc
export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        # TODO: Query the cart once built
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  console.log(data?.authenticatedItem);
  return data?.authenticatedItem;
}
