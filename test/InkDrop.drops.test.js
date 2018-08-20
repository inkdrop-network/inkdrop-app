const InkDrop = artifacts.require('InkDrop')

contract('InkDrop (drop functions)', async accounts => {
  before('initial setup with user creation', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser('testuser7', 'testbio', 'testhash', { from: accounts[7] })
    await inkdropInstance.createUser('testuser8', 'testbio', 'testhash', { from: accounts[8] })
    await inkdropInstance.createUser('testuser9', 'testbio', 'testhash', { from: accounts[9] })
  })

  it('...drop message with minimum amount', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world', { from: accounts[9] })
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should be now 1 message.')
    let user = await inkdropInstance.getUser(accounts[9])
    assert.equal(user[5].length, 1, 'The user should have as well 1 message.')
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      0,
      'The contract should have 0 balance.'
    )
    let authorBalance = web3.eth.getBalance(accounts[9]).toNumber()
    await inkdropInstance.dropMessage(0, { from: accounts[7], value: 1000000000000000 })
    // check contract balance (50%)
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000,
      'The contract should have a balance of 100% of the dropped tokens.'
    )
    // check the author's balance
    assert.equal(
      web3.eth.getBalance(accounts[9]).toNumber(),
      authorBalance,
      'The author should not having got the tokens yet.'
    )
    // check the authors earned drop amounts
    user = await inkdropInstance.getUser(accounts[9])
    assert.equal(
      user[2].toNumber(),
      1000000000000000 / 2,
      'The author of the message should get 50% of the weis.'
    )
    // check the message's drops
    msg = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      1000000000000000,
      'The message should have 1000000000000000 wei.'
    )
    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000,
      'The contract should still have 100% of the drops.'
    )

    authorBalance = web3.eth.getBalance(accounts[9]).toNumber()
    await inkdropInstance.userPayout({ from: accounts[9] })

    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2,
      'The contract should now have 60% of the drops.'
    )
    user = await inkdropInstance.getUser(accounts[9])
    assert.equal(0, 0, 'The author should now have 0 earned tokens left.')
    // TODO: fix user balance check
    // assert.equal(
    //   web3.eth.getBalance(accounts[9]).toNumber(),
    //   authorBalance + 1000000000000000 / 2,
    //   'The author should now having got the payout of his 50% share.'
    // )
  })

  it("...drop message with uneven amount and check author's balance", async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world2', { from: accounts[7] })
    let authorBalance = web3.eth.getBalance(accounts[7]).toNumber()
    await inkdropInstance.dropMessage(1, { from: accounts[9], value: 1000000000000001 })

    user = await inkdropInstance.getUser(accounts[7])
    // check that the author didn't got the tokens yet
    assert.equal(
      web3.eth.getBalance(accounts[7]).toNumber(),
      authorBalance,
      'The author should not having got the tokens yet.'
    )

    // check the authors earned drops
    assert.equal(
      user[2].toNumber(),
      Math.floor(1000000000000001 / 2),
      'The author of the message should get 50% of the weis minus remainer.'
    )
    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2 + 1000000000000001,
      'The contract should still have 100% of the drops before the payout.'
    )

    let authorBalance2 = web3.eth.getBalance(accounts[7]).toNumber()
    // check that the author didn't got the tokens yet
    assert.equal(
      web3.eth.getBalance(accounts[7]).toNumber(),
      authorBalance2,
      'The author should not having got the tokens yet.'
    )
  })

  it('...drop message with too little amount', async () => {
    let inkdropInstance = await InkDrop.deployed()

    try {
      await inkdropInstance.dropMessage(0, { from: accounts[7], value: 100000000000000 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message with 0 amount', async () => {
    let inkdropInstance = await InkDrop.deployed()

    try {
      await inkdropInstance.dropMessage(0, { from: accounts[7], value: 0 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message out of bounce', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.dropMessage(10, { from: accounts[8], value: 100000000000000 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.dropMessage(1, { from: accounts[3], value: 100000000000000 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber(), 0, 'The author should have 0 balance.')

    await inkdropInstance.createMessage('Hello world3', {
      from: accounts[8],
      value: 1000000000000000,
    })

    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2 + 1000000000000001 + 1000000000000000,
      'The contract should have all of the drops from createMessage.'
    )

    let authorBalance = web3.eth.getBalance(accounts[8]).toNumber()

    let msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      1000000000000000,
      'The message should have 1000000000000000 wei.'
    )

    await inkdropInstance.dropMessage(2, { from: accounts[7], value: 2000000000000000 })
    await inkdropInstance.dropMessage(2, { from: accounts[9], value: 1000000000000000 })
    // TODO: fix user balance check
    // check payout to author
    // assert.equal(
    //   web3.eth.getBalance(accounts[8]).toNumber(),
    //   authorBalance + 2000000000000000 / 2 + 1000000000000000 / 2,
    //   'The author should get 50% of the dropped tokens.'
    // )
    // check authors drops
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(
      user[2].toNumber(),
      2000000000000000 / 2 + 1000000000000000 / 2,
      'The author should have earned 50% of the dropped tokens.'
    )
    // check the message's drops
    msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      4000000000000000,
      'The message should have now 4000000000000000 wei.'
    )
    // check contract's balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2 +
        1000000000000001 +
        1000000000000000 +
        2000000000000000 +
        1000000000000000,
      'The contract should have the 50% of the remaining drops.'
    )
  })

  it('...drop message from a user with insufficient funds', async () => {
    let inkdropInstance = await InkDrop.deployed()

    try {
      // try to drop message with 200eth
      await inkdropInstance.dropMessage(1, { from: accounts[8], value: 200000000000000000000 })
      assert.fail('Should throw error.')
    } catch (error) {
      const errorFound = error.message.search("sender doesn't have enough funds to send tx") >= 0
      assert.equal(
        errorFound,
        true,
        `Expected "sender doesn't have enough funds to send tx", got ${error} instead`
      )
    }
  })

  it('...user payout pull approach', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let contractBalance = web3.eth.getBalance(inkdropInstance.address).toNumber()
    let user = await inkdropInstance.getUser(accounts[7])
    assert.equal(user[2].toNumber(), 500000000000000, 'The user should have 500000000000000 wei.')
    let authorBalance = web3.eth.getBalance(accounts[7]).toNumber()

    let tx = await inkdropInstance.userPayout({ from: accounts[7] })

    user = await inkdropInstance.getUser(accounts[7])

    // check the earned drops of the user
    assert.equal(user[2].toNumber(), 0, 'The user should have now 0 earned wei.')
    // check the contract's balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      contractBalance - 500000000000000,
      'The contract should have less balance after the payout.'
    )
    // TODO: fix user balance check
    assert.equal(
      web3.eth.getBalance(accounts[7]).toNumber(),
      authorBalance + 500000000000000 - tx.receipt.gasUsed,
      'The author should now have received his earned weis through the payout.'
    )
  })

  it('...user payout from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.userPayout({ from: accounts[3] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...user payout from a user with no balance', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser('testuser6', 'testbio', 'testhash', { from: accounts[6] })
    await inkdropInstance.createMessage('Hello world6', { from: accounts[6] })
    try {
      await inkdropInstance.userPayout({ from: accounts[6] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...user payout extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world8', { from: accounts[8] })
    let authorBalance = web3.eth.getBalance(accounts[8]).toNumber()
    let userInit = await inkdropInstance.getUser(accounts[8])
    assert.equal(
      userInit[2].toNumber(),
      1500000000000000,
      'The author should have 1500000000000000 earned drops.'
    )

    await inkdropInstance.dropMessage(3, { from: accounts[7], value: 2000000000000000 })
    await inkdropInstance.dropMessage(3, { from: accounts[9], value: 3000000000000000 })

    // check the message's drops
    msg = await inkdropInstance.getMessage(3, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      5000000000000000,
      'The message should have now 5000000000000000 wei.'
    )

    // check authors drops
    let user = await inkdropInstance.getUser(accounts[8])
    assert.equal(
      user[2].toNumber(),
      userInit[2].toNumber() + 2000000000000000 / 2 + 3000000000000000 / 2,
      'The author should have earned 50% of the dropped tokens.'
    )
  })
})
