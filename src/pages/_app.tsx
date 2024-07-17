import { AppProps } from 'next/app';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
