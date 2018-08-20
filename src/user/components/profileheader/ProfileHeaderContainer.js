// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import ProfileHeader from './ProfileHeader'
import { USER_PAYOUT_REQUESTED } from '../../userSagas'

const mapStateToProps = state => {
	return {
		user: state.user.data,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onUserPayout: () => {
			dispatch({ type: USER_PAYOUT_REQUESTED })
		},
	}
}

const ProfileHeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileHeader)

export default ProfileHeaderContainer
