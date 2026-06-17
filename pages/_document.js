import { Html, Head, Main, NextScript } from 'next/document';

// Applies the saved theme before first paint to avoid a flash, and registers the
// favicon site-wide.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='crt'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
