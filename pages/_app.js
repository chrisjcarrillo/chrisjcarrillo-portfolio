import '../styles/globals.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

library.add(fab);

export default MyApp
