import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const setAppTheme = `
  const initialThemeKey = 'initial_theme';
  const localStorageKey = 'app_theme';
  const currentAppTheme = window.localStorage.getItem(localStorageKey);
  console.log(currentAppTheme);
  let initialTheme = null;
  if (!currentAppTheme) {
    initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    window.localStorage.setItem(initialThemeKey, initialTheme);
  } 
  document.body.classList.add(currentAppTheme ?? initialTheme);
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