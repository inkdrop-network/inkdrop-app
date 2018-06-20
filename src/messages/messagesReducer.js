const initialState = {
  data: [],
  userdata: [],
  commentsdata: [],
  count: 0,
  initialized: false,
}

const messagesReducer = (state = initialState, action) => {
  if (action.type === 'MESSAGES_GOT') {
    return Object.assign({}, state, {
      data: action.payload,
    })
  }

  if (action.type === 'MESSAGE_GOT') {
    let newData = state.data.concat(action.payload)
    return Object.assign({}, state, {
      data: newData,
      // eslint-disable-next-line
      initialized: newData.length == state.count,
    })
  }

  if (action.type === 'MESSAGE_TX_SUCCESS') {
    return Object.assign({}, state, {
      data: state.data.filter(msg => msg.id !== action.payload.id),
    })
  }

  if (action.type === 'MESSAGE_COUNT_GOT') {
    return Object.assign({}, state, {
      count: action.payload,
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

  if (action.type === 'UPDATE_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (!item.fromBlockchain && item.id === action.id) {
          return { ...item, ...action.payload }
        }

        return item
      }),
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

  if (action.type === 'COMMENT_POSTED') {
    return Object.assign({}, state, {
      commentsdata: state.commentsdata.concat(action.payload),
    })
  }

  if (action.type === 'COMMENT_TX_SUCCESS') {
    return Object.assign({}, state, {
      commentsdata: state.commentsdata.filter(comment => comment.id !== action.payload.id),
    })
  }

  // if (action.type === 'COMMENT_MESSAGE') {
  //   let newState = Object.assign({}, state, {
  //     data: state.data.map((item, index) => {
  //       if (item.id === action.parent) {
  //         let newItem = {
  //           ...item,
  //           comments: [...item.comments, action.payload],
  //         }
  //         return newItem
  //       }

  //       return item
  //     }),
  //   })
  //   return newState
  // }

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
