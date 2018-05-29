import { drizzleConnect } from 'drizzle-react'
import ProfileHeader from './ProfileHeader'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.user.data.name,
    bio: state.user.data.bio,
    drops: state.user.data.drops,
    imgUrl: state.user.data.imgUrl,
    followers: state.user.data.followers,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

const ProfileHeaderContainer = drizzleConnect(ProfileHeader, mapStateToProps, mapDispatchToProps)

export default ProfileHeaderContainer
