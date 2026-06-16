import Head from 'next/head';
import Terminal from '../components/Terminal/Terminal';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-6 font-mono">
      <Head>
        <title>Chris Carrillo — Creative &amp; Software Engineer</title>
        <meta
          name="description"
          content="Chris Carrillo — a Miami-based creative and software engineer."
        />
      </Head>

      <Terminal />
    </div>
  );
}
