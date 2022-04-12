/* eslint-disable react/prop-types */

import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';
import { CartItemStyles } from './styles/CartStyles';

const CartItem = ({ cartItem }) => {
  const { product } = cartItem;
  const productImage = product.photo.image.publicUrlTransformed;

  if (!product) return null;

  return (
    // li
    <CartItemStyles>
      <img src={productImage} alt={product.name} width="100" />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)} -{' '}
          <span>
            {cartItem.quantity} &times; {formatMoney(product.price)} each
          </span>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
};

export default CartItem;
