import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
  ${reset}

  body, html {
    height: 100%;
  }

  #__next {
    position: absolute;
    inset: 0;
  }
`
