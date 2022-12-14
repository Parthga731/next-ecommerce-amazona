import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/store';
import axios from 'axios';
import { toast } from 'react-toastify';

function CartScreen() {
  const { state, dispatch }: any = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item: any) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const updateCartHandler = async (item: any, qty: any) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    toast.success('Product updated in the cart');
  };

  return (
    <Layout title='shopping cart'>
      <h1 className='mb-4 text-xl'>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full '>
              <thead className='border-b'>
                <tr>
                  <th className='p-5 text-left'>Item</th>
                  <th className='p-5 text-right'>Quantity</th>
                  <th className='p-5 text-right'>Price</th>
                  <th className='p-5'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: any) => (
                  <tr key={item.slug} className='border-b'>
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className='flex items-center'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className='p-5 text-right'>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }>
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='p-5 text-right'>${item.price}</td>
                    <td className='p-5 text-center'>
                      <button onClick={() => removeItemHandler(item)}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5'>
            <ul>
              <li>
                <div className='pb-3 text-xl'>
                  Subtotal (
                  {cartItems.reduce((a: any, c: any) => a + c.quantity, 0)}) : $
                  {cartItems.reduce(
                    (a: any, c: any) => a + c.quantity * c.price,
                    0
                  )}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className='primary-button w-full'>
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
