import React from 'react'
import styles from '../styles/UserImage.module.css'

export default function userImage({ user, logout }) {
  return (
    <div className={styles.userImageRoot}>
      <div className={styles.picture}>
        <img alt="user" src={user.picture} />
      </div>
      <div className={styles.name}>
        {user.name}
        <div className={styles.logout}>
          <button type="button" onClick={logout}>
            efetuar log out
          </button>
        </div>
      </div>
    </div>
  )
}
