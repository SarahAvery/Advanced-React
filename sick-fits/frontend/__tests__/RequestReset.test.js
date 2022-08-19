import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';

import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { fakeUser } from '../lib/testUtils';

const email = 'testemail@email.ca';
const successMsg = /Please check you email for a link/i;

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email },
    },
    result: {
      data: { sendUserPasswordResetLink: null },
    },
  },
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation when submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    userEvent.type(screen.getByPlaceholderText('your email address'), email);

    userEvent.click(screen.getByText(/Request Reset/));

    const success = await screen.findByText(successMsg);
    expect(success).toBeInTheDocument();
  });
});
