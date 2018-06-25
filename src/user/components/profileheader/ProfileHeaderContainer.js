import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import ProfileHeader from './ProfileHeader'

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.user.data,
	}
}

const mapDispatchToProps = dispatch => {
	return {}
}

const ProfileHeaderContainer = drizzleConnect(ProfileHeader, mapStateToProps, mapDispatchToProps)

export default ProfileHeaderContainer
