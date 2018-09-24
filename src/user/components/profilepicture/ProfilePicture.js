import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

class ProfilePicture extends PureComponent {
	constructor(props) {
		super(props)
		this.state = { showImage: false }

		this.handleImageLoaded = this.handleImageLoaded.bind(this)
		this.handleImageErrored = this.handleImageErrored.bind(this)
	}

	handleImageLoaded() {
		this.setState({ showImage: true })
	}

	handleImageErrored() {
		this.setState({ showImage: false })
	}

	render() {
		if (this.props.url.length > 0) {
			let altImage = !this.state.showImage
			let imageClass = this.state.showImage ? '' : 'd-none'
			return (
				<React.Fragment>
					<img
						id="profile-picture"
						className={`profile-img ${imageClass}`}
						src={this.props.url}
						alt="profile"
						onLoad={this.handleImageLoaded}
						onError={this.handleImageErrored}
						style={{
							width: `${this.props.diameter}px`,
							height: `${this.props.diameter}px`,
							borderRadius: `${this.props.diameter}px`,
						}}
					/>
					{altImage && (
						<Jazzicon
							diameter={this.props.diameter}
							seed={jsNumberForAddress(this.props.address)}
							paperStyles={{
								borderRadius: `${this.props.diameter}px`,
							}}
						/>
					)}
				</React.Fragment>
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
