import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

class ProfilePicture extends PureComponent {
	render() {
		if (this.props.url.length > 0) {
			return (
				<img
					id="signup-profile-picture"
					className="profile-img mb-2"
					src={this.props.url}
					alt="profile"
				/>
			)
		}
		return (
			<Jazzicon
				diameter={this.props.diameter}
				seed={jsNumberForAddress(this.props.address)}
				paperStyles={{
					borderRadius: `${this.props.diameter}px`,
				}}
			/>
		)
	}
}

ProfilePicture.propTypes = {
	diameter: PropTypes.number.isRequired,
	address: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
}

export default ProfilePicture
