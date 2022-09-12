/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductItem({ product, addToCartHandler }: any) {
  return (
    <div className='card'>
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            alt={product.name}
            className='rounded shadow'
            height={300}
            width={300}
          />
        </a>
      </Link>
      <div className='flex flex-col items-center justify-center p-5 '>
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className='text-lg'>{product.name}</h2>
          </a>
        </Link>
        <p className='mb-2'>{product.brand}</p>
        <p>${product.price}</p>
        <button
          className='primary-button'
          type='button'
          onClick={() => addToCartHandler(product)}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}
