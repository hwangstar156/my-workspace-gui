import type { AppProps } from 'next/app'
import { LayoutComponent } from '../components/shared/layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  )
}
