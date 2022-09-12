import type { NextPage } from 'next';
import { useContext } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/store';
import axios from 'axios';
import { toast } from 'react-toastify';
// import styles from '../styles/Home.module.css'

const Home: NextPage = ({ products }: any) => {
  const { state, dispatch }: any = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product: any) => {
    const exitItem = cart.cartItems.find(
      (item: any) => item.slug === product.slug
    );
    const quantity = exitItem ? exitItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };

  console.log(products);
  return (
    <Layout title='Home Page'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product: any) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  // console.log(products);

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
