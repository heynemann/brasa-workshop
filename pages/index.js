import React from 'react'
import Head from 'next/head'
import { useMutation } from '@apollo/client'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import AuthLoading from '../components/authLoading'
import UserImage from '../components/userImage'
import {
  ADD_TODO,
  DELETE_TODO,
  UPDATE_TODO,
  CLEAR_COMPLETED_TODOS,
} from '../queries'
import styles from '../styles/Home.module.css'

const home = () => {
  const [add] = useMutation(ADD_TODO)
  const [del] = useMutation(DELETE_TODO)
  const [upd] = useMutation(UPDATE_TODO)
  const [clear] = useMutation(CLEAR_COMPLETED_TODOS)

  const { isLoading, error, user, logout } = useAuth0()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return (
      <div>
        Oops...
        {error.message}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Brasa Workshop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.right}>
          <UserImage user={user} logout={logout} />
        </div>
        <h1 className={styles.title}>Brasa Forum</h1>
        <p>{user.name}</p>
      </main>
    </div>
  )
}

export default withAuthenticationRequired(home, {
  onRedirecting: () => <AuthLoading />,
})
