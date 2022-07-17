import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import '../styles/reset.css'
import '../styles/globals.css'

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
  </QueryClientProvider>
)

export default MyApp;