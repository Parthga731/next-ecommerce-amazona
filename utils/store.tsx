import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext('cart');

const cartCookies: string | undefined = Cookies.get('cart');
// console.log(cartCookies);

const initialState: any = {
  cart: cartCookies
    ? JSON.parse(cartCookies)
    : { cartItems: [], shippingAddress: {}, paymentMethod: '' },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const exitItem = state.cart.cartItems.find(
        (item: any) => item.slug === newItem.slug
      );

      const cartItems = exitItem
        ? state.cart.cartItems.map((item: any) =>
            item.name === exitItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      console.log(cartItems);
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item: any) => item.slug !== action.payload.slug
      );
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    case 'CART_CLEAR_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value: any = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
