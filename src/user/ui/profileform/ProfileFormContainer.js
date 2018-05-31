import { drizzleConnect } from 'drizzle-react'
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

const ProfileFormContainer = drizzleConnect(ProfileForm, mapStateToProps, mapDispatchToProps)

export default ProfileFormContainer
