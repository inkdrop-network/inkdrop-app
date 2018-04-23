import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'
import { updateUser } from './ProfileFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.user.data.name,
    bio: state.user.data.bio,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onProfileFormSubmit: (name, bio) => {
      event.preventDefault();

      dispatch(updateUser(name, bio))
    }
  }
}

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default ProfileFormContainer
