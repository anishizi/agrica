import { AppProps } from 'next/app';
import '../styles/globals.css'; // Make sure this path matches your styles path

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
