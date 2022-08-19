import gql from 'graphql-tag';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';

const ParaStyle = styled.p`
  display: flex;
  align-self: center;
  font-size: 16px;
`;

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;
export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // send email, pass, name to gql
    const res = await signup().catch(console.error);
    console.log('res', res);
    resetForm();
  }

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up For An Account</h2>
      <Error error={error} />
      <fieldset>
        {data?.createUser && (
          <ParaStyle>
            Horray! You signed up with {data.createUser.email} - Please go ahead
            and sign in!
          </ParaStyle>
        )}
        <label htmlFor="name">
          Full Name
          <input
            type="text"
            name="name"
            placeholder="first and last name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="your email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            placeholder="************"
            name="password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up</button>
      </fieldset>
    </Form>
  );
}

export { SIGNUP_MUTATION };
