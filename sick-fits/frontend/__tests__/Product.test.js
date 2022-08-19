/* eslint-disable prettier/prettier */
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Product from '../components/Product';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

describe('<Product/>', () => {
  it('Renders out the price tag and title', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    // price
    const priceTag = screen.getByText('$50');
    expect(priceTag).toBeInTheDocument();

    // title
    const title = container.querySelector('h3');
    expect(title).toBeInTheDocument();

    // title link
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/product/abc123');
    expect(link).toHaveTextContent(product.name);
  });

  it('renders and matches the snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('Renders the image properly', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    // get the image
    const img = screen.getByAltText(product.name);
    expect(img).toBeInTheDocument();
  });
});
