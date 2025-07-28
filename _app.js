import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Remove duplicate Montserrat font link, fonts are loaded globally */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}