import Link from "next/link";

const Home = () => {
  return (
    <>
      <h2>Home</h2>
      <p>
        <Link href="/game">
          <a>Game</a>
        </Link>
      </p>
    </>
  );
};

export default Home;
