import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = 'passWord';
const signedUpMessage = `Horray! You signed up with ${me.email} - Please go ahead and sign in!`;

const mock = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
];

describe('<SignUp/>', () => {
  it('Renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it.only('Calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mock}>
        <SignUp />
      </MockedProvider>
    );

    // type into inputs
    await userEvent.type(
      screen.getByPlaceholderText('first and last name'),
      me.name
    );
    await userEvent.type(
      screen.getByPlaceholderText('your email address'),
      me.email
    );
    await userEvent.type(screen.getByPlaceholderText('************'), password);

    // click the submit button
    await userEvent.click(screen.getByText('Sign Up'));

    await screen.findByText(signedUpMessage);
  });
});
