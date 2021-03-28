/* eslint-disable no-undef */

import { Auth0Provider } from '@auth0/auth0-react'
import Router from 'next/router'
import React from 'react'
import { Auth0Domain, Auth0ClientId } from '../constants'
import AuthorizedApolloProvider from '../components/authorizedApolloProvider'
import '../styles/globals.css'

const onRedirectCallback = (appState) => {
  Router.replace(appState?.returnTo || '/')
}

function RootApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={Auth0Domain}
      clientId={Auth0ClientId}
      redirectUri={
        typeof window !== 'undefined' &&
        window != null &&
        window.location.origin
      }
      onRedirectCallback={onRedirectCallback}
    >
      <AuthorizedApolloProvider>
        <Component {...pageProps} />
      </AuthorizedApolloProvider>
    </Auth0Provider>
  )
}

export default RootApp
