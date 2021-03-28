import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Router from 'next/router'
import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export default ({ children }) => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0()

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_SLASH_GRAPHQL_ENDPOINT}/graphql`,
  })

  const authLink = setContext(async (_, { headers }) => {
    if (!isAuthenticated) {
      return { headers }
    }

    const token = await getIdTokenClaims()

    return {
      headers: {
        ...headers,
        Authorization: token ? token.__raw : '', // eslint-disable-line no-underscore-dangle
      },
    }
  })

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
