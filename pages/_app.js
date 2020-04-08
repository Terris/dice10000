import Head from "next/head";
import { Header } from "../components/Header";
import "../css/core.css";

const DiceApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Dice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default DiceApp;
