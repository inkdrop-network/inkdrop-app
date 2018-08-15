import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import {
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import LogoutButtonContainer from '../logoutbutton/LogoutButtonContainer'
import { roundFloat3 } from '../../../utils/rounder'

// Images
// import iconAlarm from '../../../../public/icons/icon-alarm.svg'
// import iconMessage from '../../../../public/icons/icon-message.svg'
// import inkdropWhite from '../../../../public/icons/icon-inkdrop-white.svg'

class ProfileHeader extends PureComponent {
  // constructor(props) {
  //   super(props)
  //   // TODO: Check why ProfileHeader in initiated after every account snyc
  //   console.log('Profile header created')
  // }

  render() {
    return (
      <Nav navbar className="d-inline-flex flex-row">
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret className="py-0">
            <img
              id="profile-picture"
              className="mr-1 profile-img"
              src={this.props.user.imgUrl}
              alt="profile"
            />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem disabled>@{this.props.user.name}</DropdownItem>
            <DropdownItem header>{this.props.user.bio}</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <Link to="/newsfeed" className="">
                Newsfeed
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link to="/profile" className="">
                Update profile
              </Link>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <LogoutButtonContainer />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

        <NavItem className="ml-3 d-flex align-items-center">
          {/* <img
            src={inkdropWhite}
            className="align-middle nav-icons"
            width="20"
            height="20"
            alt="drops"
          /> */}
          <span id="profile-drop-number" className="nav-icon-nr font-white">
            {roundFloat3(this.props.user.drops)} ETH
          </span>
        </NavItem>
      </Nav>
    )
  }
}

ProfileHeader.propTypes = {
  user: PropTypes.object,
}

export default ProfileHeader
