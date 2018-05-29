import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

class Message extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.dataKey = this.contracts.InkDrop.methods.getMessage.cacheCall(this.props.id)
  }
  render() {
    if (this.dataKey in this.props.InkDrop.getMessage) {
      // If the data is here, get it and display it
      let message = this.props.InkDrop.getMessage[this.dataKey].value

      return (
        <div>
          <p>{message[0]}</p>
        </div>
      )
    }
    return <div>Loading...</div>
  }
}

Message.contextTypes = {
  drizzle: PropTypes.object,
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    InkDrop: state.contracts.InkDrop,
  }
}

const MessageContainer = drizzleConnect(Message, mapStateToProps)

export default MessageContainer
