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

  // create charge w strip lib
  const charge = await stripConfig.paymentIntents.create({
    amount: amount,
    currency: 'CAD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    throw new Error(err.message)
})

console.log(charge)
  // convert cartitems to orderitems

  const orderItems = cartItems.map((cartItem) => {
      const orderItem = {
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        photo: {
          connect: {
            id: cartItem.product.photo.id,
          },
        }
      }
      return orderItem
    });


  // create order and return
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  });

  // Clean up old cart items
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  });
  return order

}

export default checkout;
