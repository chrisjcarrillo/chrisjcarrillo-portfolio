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
        <meta property="og:title" content="Chris Carrillo — Creative & Software Engineer" />
        <meta
          property="og:description"
          content="An interactive terminal portfolio — a Miami-based creative and software engineer."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chrisjcarrillo.dev" />
        <meta property="og:image" content="https://chrisjcarrillo.dev/api/og" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chris Carrillo — Creative & Software Engineer" />
        <meta name="twitter:image" content="https://chrisjcarrillo.dev/api/og" />
      </Head>

      <Terminal />
    </div>
  );
}
