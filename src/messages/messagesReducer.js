const initialState = {
  data: [],
  initialized: false,
}

// actions
export const MESSAGES_GOT = 'MESSAGES_GOT'
export const MESSAGE_GOT = 'MESSAGE_GOT'
export const MESSAGE_POSTED = 'MESSAGE_POSTED'
export const COMMENT_POSTED = 'COMMENT_POSTED'

export const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UPDATE_MESSAGE_COMMENTS = 'UPDATE_MESSAGE_COMMENTS'

export const DELETE_MESSAGE = 'DELETE_MESSAGE'
export const DELETE_COMMENT = 'DELETE_COMMENT'

// reducer
const messagesReducer = (state = initialState, action) => {
  if (action.type === MESSAGES_GOT) {
    return Object.assign({}, state, {
      initialized: action.payload,
    })
  }

  if (action.type === MESSAGE_GOT) {
    return Object.assign({}, state, {
      data: state.data.concat(action.payload),
    })
  }

  if (action.type === DELETE_MESSAGE) {
    return Object.assign({}, state, {
      data: state.data.filter(msg => msg.id !== action.payload.id),
    })
  }

  if (action.type === MESSAGE_POSTED) {
    return Object.assign({}, state, {
      data: state.data.concat(action.payload),
    })
  }

  if (action.type === UPDATE_MESSAGE) {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload }
        }
        return item
      }),
    })
  }

  if (action.type === UPDATE_MESSAGE_COMMENTS) {
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

  if (action.type === COMMENT_POSTED) {
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

  if (action.type === UPDATE_COMMENT) {
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

  return state
}

export default messagesReducer
