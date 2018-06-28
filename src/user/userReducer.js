const initialState = {
  data: null,
}

// actions
export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const USER_UPDATED = 'USER_UPDATED'
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
