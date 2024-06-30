import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import withAuth from '@/components/WithAuth';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const protectedPathPattern = /^\/protected\//;

  const WrappedComponent = protectedPathPattern.test(router.pathname)
    ? withAuth(Component)
    : Component;

  return <WrappedComponent {...pageProps} />;
}

export default MyApp;
