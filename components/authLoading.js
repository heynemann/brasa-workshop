import React from 'react'
import DotLoader from 'react-spinners/ClipLoader'
import styles from '../styles/Home.module.css'

export default function authLoading() {
  return (
    <div className={styles.main}>
      <h1>Validando sua conta de usuário</h1>
      <p>Por favor aguarde enquanto redirecionamos você...</p>
      <p />
      <div className={styles.spinner}>
        <DotLoader color="#00ff00" size={60} />
      </div>
      <p />
    </div>
  )
}
