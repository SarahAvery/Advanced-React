// import { MockedProvider } from '@apollo/react-testing';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

const {
  SINGLE_ITEM_QUERY,
  default: SingleProduct,
} = require('../components/SingleProduct');
const { fakeItem } = require('../lib/testUtils');

const product = fakeItem();

const mocks = [
  {
    // when someone requests this query and variable
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: '123',
      },
    },
    // return this data
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<Single Product/>', () => {
  it('Renders with proper data.', async () => {
    // Mocks
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );

    // wait for test id - otherwise will show 'loading'
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('Errors out when an item is not found.', async () => {
    const errorMock = [
      {
        // when someone requests this query and variable
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: '123',
          },
        },
        // return this error
        result: {
          errors: [
            {
              message: 'Item not found!',
            },
          ],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMock}>
        <SingleProduct id="123" />
      </MockedProvider>
    );

    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found!');
  });
});
