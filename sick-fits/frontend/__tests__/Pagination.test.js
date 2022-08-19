/* eslint-disable no-unused-vars */
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';

describe('<Pagination/>', () => {
  it('Displays a loading message', () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination />
      </MockedProvider>
    );

    expect(container.textContent).toBe('Loading...');
    expect(container).toMatchSnapshot();
  });

  it('Renders pagination for 18 items', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');
    expect(container).toHaveTextContent('Page 1 of 9');

    expect(container).toMatchSnapshot();
  });

  it('disables the prev page on page one', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);

    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });

  it('disables the next page on the last page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={3} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);

    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('Enables all on middle page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={2} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);

    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });
});
