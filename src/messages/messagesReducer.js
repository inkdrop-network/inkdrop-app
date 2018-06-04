const initialState = {
  data: [],
  userdata: [],
}

const messagesReducer = (state = initialState, action) => {
  if (action.type === 'MESSAGES_GOT') {
    return Object.assign({}, state, {
      data: action.payload,
    })
  }

  if (action.type === 'USER_MESSAGES_GOT') {
    return Object.assign({}, state, {
      userdata: action.payload,
    })
  }

  if (action.type === 'USER_MESSAGES_RESET') {
    return Object.assign({}, state, {
      userdata: action.payload,
    })
  }

  if (action.type === 'MESSAGE_POSTED') {
    return Object.assign({}, state, {
      data: state.data.concat(action.payload),
    })
  }

  if (action.type === 'LIKE_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.id) {
          return { ...item, ...action.payload }
        }

        return item
      }),
    })
  }

  if (action.type === 'DROP_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.map((item, index) => {
        if (item.id === action.id) {
          return { ...item, ...action.payload }
        }

        return item
      }),
    })
  }

  if (action.type === 'COMMENT_MESSAGE') {
    let newState = Object.assign({}, state, {
      data: state.data.map((item, index) => {
        if (item.id === action.parent) {
          let newItem = {
            ...item,
            comments: [...item.comments, action.payload],
          }
          return newItem
        }

        return item
      }),
    })
    return newState
  }

  if (action.type === 'COMMENTS_GOT') {
    let newState = Object.assign({}, state, {
      data: state.data.map((item, index) => {
        if (item.id === action.parent) {
          return { ...item, ...action.payload }
        }

        return item
      }),
    })
    return newState
  }

  return state
}

export default messagesReducer
