/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is out own custom provider. Store data (state) and functionality (updates) in here. Can be accessed via tthe consumer

  // closed by default
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    // set the opposite of current state (true/false)
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// custom hook for accessing the cart local state
function useCart() {
  // use a Consumer to access the local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
