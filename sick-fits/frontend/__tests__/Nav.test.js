import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';

// Mocks for being logged out, logged in, and logged in with cart items

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem()],
        }),
      },
    },
  },
];

describe('<Nav/>', () => {
  it('Renders a minimal nav when signed out', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    expect(container).toHaveTextContent('sign in');

    const link = screen.getByText('sign in');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signin');

    const productsLink = screen.getByText('products');
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');

    expect(container).toMatchSnapshot();
  });

  it('Renders a full nav when signed in', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByText('account');

    expect(container).toHaveTextContent('Sign Out');
    expect(container).toHaveTextContent('Cart');

    expect(container).toMatchSnapshot();
  });

  it('renders the amount of items in the cart', async function () {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByText('account');

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
