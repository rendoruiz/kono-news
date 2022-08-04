import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'

import '../styles/globals.css'

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </ThemeProvider>
)

export default MyApp;