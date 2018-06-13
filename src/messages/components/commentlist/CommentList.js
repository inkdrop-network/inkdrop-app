import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentItemContainer from '../commentitem/CommentItemContainer'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // check for all chached comments if they were submitted to the blockchain
    for (let i = 0; i < this.props.comments.length; i++) {
      this.updateCommentTx(prevProps, this.props.comments[i])
    }
  }

  updateCommentTx(prevProps, comment) {
    let stackId = comment.id
    if (this.props.transactionStack[stackId]) {
      const txHash = this.props.transactionStack[stackId]
      // remove comment from local store if tx was successful
      if (
        txHash in prevProps.transactions &&
        prevProps.transactions[txHash].status === 'pending' &&
        this.props.transactions[txHash].status === 'success'
      ) {
        // console.log('TxHash: ' + txHash)
        // console.log('Tx Status: ' + this.props.transactions[txHash].status)
        this.props.onCommentTxSuccess(comment)
      }
    }
  }

  render() {
    return (
      <div className="comments">
        {this.props.message.comments.map(commentId => (
          <CommentItemContainer
            commentId={commentId}
            cached={false}
            cachedComment={false}
            key={commentId}
          />
        ))}
        {this.props.comments.map(comment => (
          <CommentItemContainer
            commentId={comment.id}
            cached={true}
            cachedComment={comment}
            key={comment.id}
          />
        ))}
        <CommentFormContainer message={this.props.message} />
      </div>
    )
  }
}

CommentList.contextTypes = {
  drizzle: PropTypes.object,
}

export default CommentList
