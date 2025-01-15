import type { AppProps } from 'next/app'
import { LayoutComponent } from '../components/shared/layout'
import { GlobalStyle } from '../styles/global-style'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutComponent>
      <GlobalStyle />
      <Component {...pageProps} />
    </LayoutComponent>
  )
}
