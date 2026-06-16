import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { content } from '../data/content';
import Terminal from '../components/Terminal/Terminal';

export default function Home() {
  const c = content.contact;

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen font-mono">
      <Head>
        <title>Chris Carrillo — Creative &amp; Software Engineer</title>
        <meta
          name="description"
          content="Chris Carrillo — a Miami-based creative and software engineer."
        />
      </Head>

      <main className="w-full flex flex-wrap items-center gap-y-12 px-8 md:px-16 xl:px-72 animate-fade-in-up">
        <div className="flex-1 basis-full md:basis-1/2 flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-light italic tracking-wider">Hello World!</h1>
          <h1 className="text-5xl md:text-6xl font-bold tracking-wider mt-2">
            I&apos;m {content.alias}.
          </h1>
          <h2 className="text-2xl md:text-3xl font-light tracking-wider mt-4 leading-snug">
            {content.tagline[0]} <br /> {content.tagline[1]}
          </h2>
          <div className="flex gap-12 mt-10">
            <a href={c.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FontAwesomeIcon icon={['fab', 'linkedin-in']} size="2x" />
            </a>
            <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" />
            </a>
            <a href={c.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FontAwesomeIcon icon={['fab', 'github']} size="2x" />
            </a>
          </div>
        </div>

        <div className="flex-1 basis-full md:basis-1/2 md:pl-12">
          <Terminal />
        </div>
      </main>
    </div>
  );
}
