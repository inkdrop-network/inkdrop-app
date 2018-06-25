const initialState = {
  data: [],
  // userdata: [],
  // commentsdata: [],
  // count: 0,
  initialized: false,
}

const messagesReducer = (state = initialState, action) => {
  if (action.type === 'MESSAGES_GOT') {
    return Object.assign({}, state, {
      initialized: action.payload,
    })
  }

  if (action.type === 'MESSAGE_GOT') {
    return Object.assign({}, state, {
      data: state.data.concat(action.payload),
    })
  }

  // if (action.type === 'MESSAGE_TX_SUCCESS') {
  //   return Object.assign({}, state, {
  //     data: state.data.filter(msg => msg.id !== action.payload.id),
  //   })
  // }

  // if (action.type === 'MESSAGE_COUNT_GOT') {
  //   return Object.assign({}, state, {
  //     count: action.payload,
  //   })
  // }

  // if (action.type === 'USER_MESSAGES_GOT') {
  //   return Object.assign({}, state, {
  //     userdata: action.payload,
  //   })
  // }

  // if (action.type === 'USER_MESSAGES_RESET') {
  //   return Object.assign({}, state, {
  //     userdata: action.payload,
  //   })
  // }

  if (action.type === 'MESSAGE_POSTED') {
    return Object.assign({}, state, {
      data: state.data.concat(action.payload),
    })
  }

  if (action.type === 'DELETE_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.filter(msg => msg.id !== action.payload.id),
    })
  }

  if (action.type === 'UPDATE_MESSAGE_COMMENTS') {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            comments: item.comments.concat(action.payload),
          }
        }
        return item
      }),
    })
  }

  if (action.type === 'UPDATE_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload }
        }
        return item
      }),
    })
  }

  if (action.type === 'LIKE_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload }
        }

        return item
      }),
    })
  }

  if (action.type === 'DROP_MESSAGE') {
    return Object.assign({}, state, {
      data: state.data.map((item, index) => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload }
        }

        return item
      }),
    })
  }

  // if (action.type === 'COMMENT_POSTED') {
  //   return Object.assign({}, state, {
  //     commentsdata: state.commentsdata.concat(action.payload),
  //   })
  // }

  // if (action.type === 'COMMENT_TX_SUCCESS') {
  //   return Object.assign({}, state, {
  //     commentsdata: state.commentsdata.filter(comment => comment.id !== action.payload.id),
  //   })
  // }

  if (action.type === 'COMMENT_POSTED') {
    return Object.assign({}, state, {
      data: state.data.map((item, index) => {
        if (item.id === action.payload.parent) {
          return {
            ...item,
            comments: [...item.comments, action.payload],
          }
        }

        return item
      }),
    })
  }

  if (action.type === 'UPDATE_COMMENT') {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.payload.parent) {
          return {
            ...item,
            comments: item.comments.map(comment => {
              if (comment.id === action.payload.id) {
                return {
                  ...comment,
                  ...action.payload,
                }
              }
              return comment
            }),
          }
        }

        return item
      }),
    })
  }

  //   if (action.type === 'COMMENTS_GOT') {
  //     let newState = Object.assign({}, state, {
  //       data: state.data.map((item, index) => {
  //         if (item.id === action.parent) {
  //           return { ...item, ...action.payload }
  //         }

  //         return item
  //       }),
  //     })
  //     return newState
  //   }

  return state
}

export default messagesReducer
