import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const setAppTheme = `
  const localStorageKey = 'app_theme';
  const currentAppTheme = window.localStorage.getItem(localStorageKey);
  if (!currentAppTheme) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      window.localStorage.setItem(localStorageKey, 'dark');
    } else {
      window.localStorage.setItem(localStorageKey, 'light');
    }
  } else {
    document.body.classList.add(currentAppTheme);
  }
`;

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather&family=Open+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script 
          strategy='afterInteractive' 
          dangerouslySetInnerHTML={{ __html: `(() => { ${setAppTheme} })()` }} 
        />
      </body>
    </Html>
  )
}