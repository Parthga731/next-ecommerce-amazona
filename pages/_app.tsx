import '../styles/globals.css';
// import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreProvider } from '../utils/store';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const initialOptions = {
    'client-id': 'test',
    currency: 'USD',
  };

  return (
    <>
      <ToastContainer position='bottom-center' />
      <SessionProvider session={session}>
        <StoreProvider>
          <PayPalScriptProvider deferLoading={true} options={initialOptions}>
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </PayPalScriptProvider>
        </StoreProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ children, adminOnly }: any) {
  const router = useRouter();
  const { status, data: session }: any = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

export default MyApp;
