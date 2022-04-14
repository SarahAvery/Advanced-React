/* eslint-disable react/jsx-no-bind */
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import SickButton from './styles/SickButton';

const CheckoutFormStyled = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(e) {
    // stop the form from submitting and turn the loader on
    e.preventDefault();
    setLoading(true);
    console.log('we have some work to do!');

    // start page transition
    nProgress.start();

    // create payment method via stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);

    // handle errors from stripe
    if (error) {
      setError(error);
    }

    // send token to keystone server, via custom mutation

    // change page to view order

    // close cart

    // turn loader off
    setLoading(false);
    nProgress.done();
  }
  return (
    <CheckoutFormStyled onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyled>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
