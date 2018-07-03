import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './utils/wrappers.js'
import { Navbar, Nav, NavItem } from 'reactstrap'

// UI Components
import LoginButtonContainer from './user/components/loginbutton/LoginButtonContainer'
import ProfileHeaderContainer from './user/components/profileheader/ProfileHeaderContainer'

// Styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/Overpass.css'
import './App.css'

// Images
import inkdropLogo from '../public/icons/inkdrop_logo.svg'

class App extends PureComponent {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() => (
      <div className="container">
        <Link to="/newsfeed" className="navbar-brand">
          <img
            src={inkdropLogo}
            width="30"
            height="30"
            className="d-inline-block align-top py-1"
            alt="InkDrop Logo"
          />InkDrop<span className="font-green">.</span>
        </Link>
        <ProfileHeaderContainer />
      </div>
    ))

    const OnlyGuestLinks = HiddenOnlyAuth(() => (
      <div className="container">
        <Link to="/newsfeed" className="navbar-brand">
          <img
            src={inkdropLogo}
            width="30"
            height="30"
            className="d-inline-block align-top py-1"
            alt="InkDrop Logo"
          />InkDrop<span className="font-green">.</span>
        </Link>

        <Nav navbar>
          <NavItem className="mr-4">
            <Link to="/signup" className="">
              Sign Up
            </Link>
          </NavItem>
          <LoginButtonContainer />
        </Nav>
      </div>
    ))

    return (
      <div className="App">
        <Navbar color="dark" dark expand="md" className="sticky-top justify-content-between">
          <OnlyGuestLinks />
          <OnlyAuthLinks />
        </Navbar>
        {this.props.children}
      </div>
    )
  }
}

export default App
