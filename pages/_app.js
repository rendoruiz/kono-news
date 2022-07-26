import { QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'

import '../styles/globals.css'

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
    
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
)

export default MyApp;