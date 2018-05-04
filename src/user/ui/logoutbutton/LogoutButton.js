import React from 'react'

const LogoutButton = ({ onLogoutUserClick }) => {
  return (
    <li className="nav-item">
      <a href="#" className="" onClick={event => onLogoutUserClick(event)}>
        Logout
      </a>
    </li>
  )
}

export default LogoutButton
