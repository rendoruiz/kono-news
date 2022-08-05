import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'

import '../styles/globals.css'
// import { LOCALSTORAGE_KEY } from '../utils/constants';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider 
    defaultTheme='system'
    attribute='class'
  >
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </ThemeProvider>
)

export default MyApp;