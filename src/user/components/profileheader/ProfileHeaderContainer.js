// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import ProfileHeader from './ProfileHeader'

const mapStateToProps = state => {
	return {
		user: state.user.data,
	}
}

const mapDispatchToProps = dispatch => {
	return {}
}

const ProfileHeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileHeader)

export default ProfileHeaderContainer
