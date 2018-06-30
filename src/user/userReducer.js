const initialState = {
  data: null,
  signup: null,
}

// actions
export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const USER_UPDATED = 'USER_UPDATED'
export const USER_SIGNUP = 'USER_SIGNUP'
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
export const USER_DROPPED = 'USER_DROPPED'

// reducer
const userReducer = (state = initialState, action) => {
  if (action.type === USER_LOGGED_IN || action.type === USER_UPDATED) {
    return Object.assign({}, state, {
      data: action.payload,
    })
  }

  if (action.type === USER_LOGGED_OUT) {
    return Object.assign({}, state, {
      data: null,
      signup: null,
    })
  }

  if (action.type === USER_SIGNUP) {
    return Object.assign({}, state, {
      signup: {
        ...state.signup,
        ...action.payload,
      },
    })
  }

  if (action.type === USER_DROPPED) {
    return Object.assign({}, state, {
      data: {
        ...state.data,
        drops: state.data.drops - action.payload,
      },
    })
  }

  return state
}

export default userReducer
