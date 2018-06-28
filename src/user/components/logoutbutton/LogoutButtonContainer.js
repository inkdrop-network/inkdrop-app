// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import LogoutButton from './LogoutButton'

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = dispatch => {
	return {
		onLogoutUser: () => {
			dispatch({ type: 'LOGOUT_REQUESTED' })
		},
	}
}

const LogoutButtonContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LogoutButton)

export default LogoutButtonContainer
