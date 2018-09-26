// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import ProfileHeader from './ProfileHeader'
import { USER_PAYOUT_REQUESTED } from '../../userSagas'
import { USER_TOUR } from '../../userReducer'

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
		showIntroTour: () => {
			dispatch({ type: USER_TOUR, payload: true })
		},
	}
}

const ProfileHeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileHeader)

export default ProfileHeaderContainer
