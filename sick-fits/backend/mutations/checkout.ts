/* eslint-disable */

import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripConfig from '../lib/stripe';

const graphql = String.raw

async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
// user signed in?
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry, you must be signed in to create an order.')
  }
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
    id
    name
    email
    cart {
      id
      quantity
      product {
        name
        price
        description
        id
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
    `
  })
  console.dir(user, { depth: null })
  
  // calc total price
  const cartItems = user.cart.filter(cartItem => cartItem.product)
  const amount = cartItems.reduce(function (tally: number, cartItem: CartItemCreateInput) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log(amount)

  // create charge w strip lib
  const charge = await stripConfig.paymentIntents.create({
    amount: amount,
    currency: 'CAD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message)
})

  // convert cartitems to orderitems

  // create order and return

}

export default checkout;
