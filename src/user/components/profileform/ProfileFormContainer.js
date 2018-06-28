// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.user.data,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onUpdateUser: user => {
			dispatch({ type: 'USERUPDATE_REQUESTED', payload: user })
		},
	}
}

const ProfileFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileForm)

export default ProfileFormContainer
