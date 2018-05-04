import React from 'react'

const LoginButton = ({ onLoginUserClick }) => {
  return (
    <li className="nav-item mr-4">
      <a href="#" className="" onClick={event => onLoginUserClick(event)}>
        Login
      </a>
    </li>
  )
}

export default LoginButton
