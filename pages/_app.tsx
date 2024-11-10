// pages/_app.tsx
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout"; // Import the Layout component
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showNavbar = !["/auth/login", "/auth/signup"].includes(router.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
