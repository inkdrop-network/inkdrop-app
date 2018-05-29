import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'

class Home extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.state = {
      id: 1,
      content: '',
      likes: 0,
      drops: 0,
      comments: 0,
    }

    this.dataKey = this.contracts.InkDrop.methods.getMessageCount.cacheCall()
    this.mDataKey = this.contracts.InkDrop.methods.getMessage.cacheCall(1)
    this.contracts.InkDrop.methods.getMessage.cacheCall(2)

    this.handleSetButton = this.handleSetButton.bind(this)
    this.handleWriteButton = this.handleWriteButton.bind(this)
    this.handleDropButton = this.handleDropButton.bind(this)
  }

  handleSetButton() {
    this.contracts.InkDrop.methods.createUser.cacheSend(
      '0x6d696b6173000000000000000000000000000000000000000000000000000000',
      'bio',
      'QmVzxY7b5XAZdLudVccmhSGUqPt1PTKs6oRSmXrCW9URcY'
    )
  }

  handleDropButton() {
    const stackId = this.contracts.InkDrop.methods.dropMessage.cacheSend(1, 10)

    // // Use the dataKey to display the transaction status.
    // if (state.transactionStack[stackId]) {
    //     const txHash = state.transactionStack[stackId]

    //     return state.transactions[txHash].status
    // }
  }

  handleWriteButton() {
    this.contracts.InkDrop.methods.createMessage.cacheSend('Hello world', 10)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.mDataKey in nextProps.InkDrop.getMessage &&
      !(this.mDataKey in this.props.InkDrop.getMessage)
    ) {
      console.log('Call user cacheCall here')
      var message = nextProps.InkDrop.getMessage[this.mDataKey].value
      console.log('User: ' + message[1])
      this.userDataKey = this.contracts.InkDrop.methods.getUser.cacheCall(message[1])
      console.log('here')
    }
    return true
  }

  render() {
    var messageCount
    // If the data isn't here yet, show loading
    if (this.dataKey in this.props.InkDrop.getMessageCount) {
      // If the data is here, get it and display it
      messageCount = this.props.InkDrop.getMessageCount[this.dataKey].value
    }

    var message = [0, 1, 2, 3, 4, 5, []]
    // If the data isn't here yet, show loading
    if (this.mDataKey in this.props.InkDrop.getMessage) {
      // If the data is here, get it and display it
      message = this.props.InkDrop.getMessage[this.mDataKey].value
    }

    var user = ['0x']
    if (this.userDataKey in this.props.InkDrop.getUser) {
      // If the data is here, get it and display it
      user = this.props.InkDrop.getUser[this.userDataKey].value
    }

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1>Drizzle Examples</h1>
          </div>

          <div className="pure-u-1-1">
            <h2>Messages</h2>
            <p>{message[0]}</p>
            <p>{this.context.drizzle.web3.utils.toUtf8(user[0])}</p>
            <p>{message[2]}</p>
            <p>{message[3]}</p>
            <p>{parseInt(message[4], 10) / 100}</p>
            <p>{parseInt(message[5], 10) / 100}</p>
            <p>{message[6].length}</p>
            <button className="pure-button" type="button" onClick={this.handleDropButton}>
              Drop Message
            </button>
          </div>

          <div className="pure-u-1-1">
            <h2>InkDrops</h2>
            Initialized: {this.props.drizzleStatus.initialized ? 'Yes' : 'No'}
            <p>
              <strong>MessageCount</strong>:{' '}
              <ContractData contract="InkDrop" method="getMessageCount" />
            </p>
            Count: {messageCount}
            <br />
            <br />
            <button className="pure-button" type="button" onClick={this.handleSetButton}>
              Create User
            </button>
            <br />
            <br />
            <button className="pure-button" type="button" onClick={this.handleWriteButton}>
              Write Message
            </button>
            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>SimpleStorage</h2>
            <p>
              This shows a simple ContractData component with no arguments, along with a form to set
              its value.
            </p>
            <p>
              <strong>Stored Value</strong>:{' '}
              <ContractData contract="SimpleStorage" method="storedData" />
            </p>
            <ContractForm contract="SimpleStorage" method="set" />

            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>TutorialToken</h2>
            <p>
              Here we have a form with custom, friendly labels. Also note the token symbol will not
              display a loading indicator. We've suppressed it with the <code>hideIndicator</code>{' '}
              prop because we know this variable is constant.
            </p>
            <p>
              <strong>Total Supply</strong>:{' '}
              <ContractData
                contract="TutorialToken"
                method="totalSupply"
                methodArgs={[{ from: this.props.accounts[0] }]}
              />{' '}
              <ContractData contract="TutorialToken" method="symbol" hideIndicator />
            </p>
            <p>
              <strong>My Balance</strong>:{' '}
              <ContractData
                contract="TutorialToken"
                method="balanceOf"
                methodArgs={[this.props.accounts[0]]}
              />
            </p>
            <h3>Send Tokens</h3>
            <ContractForm
              contract="TutorialToken"
              method="transfer"
              labels={['To Address', 'Amount to Send']}
            />

            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>ComplexStorage</h2>
            <p>
              Finally this contract shows data types with additional considerations. Note in the
              code the strings below are converted from bytes to UTF-8 strings and the device data
              struct is iterated as a list.
            </p>
            <p>
              <strong>String 1</strong>:{' '}
              <ContractData contract="ComplexStorage" method="string1" toUtf8 />
            </p>
            <p>
              <strong>String 2</strong>:{' '}
              <ContractData contract="ComplexStorage" method="string2" toUtf8 />
            </p>
            <strong>Single Device Data</strong>:{' '}
            <ContractData contract="ComplexStorage" method="singleDD" />
            <br />
            <br />
          </div>
        </div>
      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object,
}

export default Home
