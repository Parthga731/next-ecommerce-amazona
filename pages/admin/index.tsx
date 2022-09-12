import Link from 'next/link';
import React from 'react';
import Layout from '../../components/Layout';

export default function Admin() {
  return (
    <Layout title='admin'>
      <Link href='/dashboard'>
        <a>dashboard</a>
      </Link>
    </Layout>
  );
}
